
"use client";

import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { API_BASE_URL } from "../../utils/api";
import { useRouter } from "next/navigation";
import {
  toastSuccess,
  toastError,
  toastInfo,
  toastCartAdd,
} from "@/utils/toast";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

/* Types */
type ProductResp = {
  id: number;
  part_number: string;
  name: string;
  price: number | null;
  image?: string | null;
  is_obsolete?: boolean;
  alternative_part_number?: string | null;
};

type ValidatedItem = {
  part_number: string;
  qty: number;
  product: ProductResp | null;
  mapped_to?: string | null;
  message?: string | null;
};

function extractClerkEmail(u: unknown): string | null {
  if (!u || typeof u !== "object") return null;
  const obj = u as Record<string, unknown>;

  // emailAddresses: [{ emailAddress: string }]
  if (Array.isArray(obj.emailAddresses) && obj.emailAddresses.length > 0) {
    const first = obj.emailAddresses[0];
    if (first && typeof first === "object") {
      const firstRec = first as Record<string, unknown>;
      if (typeof firstRec.emailAddress === "string")
        return firstRec.emailAddress;
    }
  }

  // primaryEmailAddress: { emailAddress: string }
  if (obj.primaryEmailAddress && typeof obj.primaryEmailAddress === "object") {
    const primary = obj.primaryEmailAddress as Record<string, unknown>;
    if (typeof primary.emailAddress === "string") return primary.emailAddress;
  }

  return null;
}

export default function QuickOrderPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const API_BASE = API_BASE_URL;
  const normalize = (s: string) => s.toString().trim().toUpperCase();
  const { isSignedIn } = useUser();

  const { user } = useUser();
  const clerkId = (user && (user.id as string)) || null;
  const clerkEmail = extractClerkEmail(user);

  const [tab, setTab] = useState<"single" | "bulk" | "paste">("single");

  // Single
  const [singlePart, setSinglePart] = useState("");
  const [singleQty, setSingleQty] = useState(1);
  const [singleResult, setSingleResult] = useState<ValidatedItem | null>(null);
  const [loadingSingle, setLoadingSingle] = useState(false);

  // Bulk
  const [file, setFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<string[]>([]);
  const [bulkItems, setBulkItems] = useState<
    Array<{ part_number: string; qty: number }>
  >([]);
  const [bulkValidated, setBulkValidated] = useState<ValidatedItem[]>([]);
  const [processingBulk, setProcessingBulk] = useState(false);

  // Paste
  const [pasteText, setPasteText] = useState("");
  const [pasteItems, setPasteItems] = useState<
    Array<{ part_number: string; qty: number }>
  >([]);
  const [pasteValidated, setPasteValidated] = useState<ValidatedItem[]>([]);
  const [processingPaste, setProcessingPaste] = useState(false);

  // RESETs
  const resetSingle = () => {
    setSinglePart("");
    setSingleQty(1);
    setSingleResult(null);
  };
  const resetBulk = () => {
    setFile(null);
    setBulkPreview([]);
    setBulkItems([]);
    setBulkValidated([]);
  };
  const resetPaste = () => {
    setPasteText("");
    setPasteItems([]);
    setPasteValidated([]);
  };
  const resetAll = () => {
    resetSingle();
    resetBulk();
    resetPaste();
  };

  /* Single lookup */
  const handleSingleLookup = async () => {
    if (!singlePart) return;
    setLoadingSingle(true);
    setSingleResult(null);
    try {
      const res = await fetch(
        `${API_BASE}/fast-order/single?part=${encodeURIComponent(singlePart)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setSingleResult({
          part_number: normalize(singlePart),
          qty: singleQty,
          product: null,
          message: json.error || "Not found",
        });
      } else {
        setSingleResult(json.item as ValidatedItem);
      }
    } catch {
      setSingleResult({
        part_number: normalize(singlePart),
        qty: singleQty,
        product: null,
        message: "Lookup failed",
      });
    }
    setLoadingSingle(false);
  };

  const addSingleToCart = () => {
    if (!singleResult || !singleResult.product) return;
    const p = singleResult.product;
    addToCart({
      id: p.id,
      name: p.name || p.part_number,
      price: p.price || 0,
      image: p.image || "/placeholder.png",
      quantity: singleQty,
    });
    toastCartAdd(p.name || p.part_number, singleQty);
    resetSingle();
  };

  /* Bulk parse / validate */
  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setBulkPreview([]);
    setBulkItems([]);
    setBulkValidated([]);
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      const lines = text.split(/\r?\n/).slice(0, 5);
      setBulkPreview(lines);
    };
    reader.readAsText(selectedFile);
  };

  const handleBulkParse = () => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (
        results: ParseResult<Record<string, string | number | null>>
      ) => {
        const items: Array<{ part_number: string; qty: number }> = [];
        for (const row of results.data.slice(0, 100)) {
          const rawPN =
            row.part_number ??
            row.part ??
            row.PartNumber ??
            row.partNumber ??
            "";
          const pn = normalize(String(rawPN));
          if (!pn) continue;
          const qtyRaw =
            row.qty ?? row.quantity ?? row.Qty ?? row.QTY ?? row.Quantity ?? 1;
          const qty = parseInt(String(qtyRaw), 10) || 1;
          items.push({ part_number: pn, qty });
        }
        setBulkItems(items);
      },
    });
  };

  const validateBulkServer = async () => {
    if (bulkItems.length === 0) return;
    setProcessingBulk(true);
    try {
      const res = await fetch(`${API_BASE}/fast-order/bulk-validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: bulkItems }),
      });
      const json = await res.json();
      if (!res.ok) {
        toastError(json.error || "Validation failed");
      } else {
        setBulkValidated(json.processed as ValidatedItem[]);
        toastSuccess("Bulk validation complete");
      }
    } catch {
      toastError("Server error");
    }
    setProcessingBulk(false);
  };

  const addBulkToCart = () => {
    let addedCount = 0;
    bulkValidated.forEach((b) => {
      if (b.product) {
        addToCart({
          id: b.product.id,
          name: b.product.name || b.product.part_number,
          price: b.product.price || 0,
          image: b.product.image || "/placeholder.png",
          quantity: b.qty,
        });
        addedCount += 1;
      }
    });
    if (addedCount > 0) toastSuccess("Added valid items to cart");
    else toastInfo("No valid items to add");
    resetBulk();
  };

  const removeBulkValidatedItem = (index: number) => {
    setBulkValidated((prev) => prev.filter((_, i) => i !== index));
  };

  /* Save Bulk as Quote */
  const saveBulkAsQuote = async () => {
    if (bulkValidated.length === 0) {
      toastInfo("No validated items to save");
      return;
    }

    const validItems = bulkValidated.filter((b) => b.product);
    const removedCount = bulkValidated.length - validItems.length;

    if (validItems.length === 0) {
      toastInfo("No valid items to save as a quote");
      return;
    }

    try {
      const payloadItems = validItems.map((b) => ({
        product_id: b.product?.id || null,
        part_number: b.part_number,
        name: b.product?.name || null,
        price: b.product?.price ?? null,
        qty: b.qty,
        mapped_to: b.mapped_to || null,
      }));

      const res = await fetch(`${API_BASE}/quotes/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: clerkId,
          user_email: clerkEmail,
          name: `Quick Bulk ${new Date().toISOString()}`,
          items: payloadItems,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toastError(json.error || "Failed to save quote");
        return;
      }

      if (removedCount > 0) {
        toastInfo(`${removedCount} invalid items were removed before saving.`);
      }

      toastSuccess(`Quote ${json.quote.quote_number} saved`);
      router.push("/quotes");
    } catch {
      toastError("Server error while saving quote");
    }
  };

  /* Paste parse / validate */
  const handlePasteParse = () => {
    const parsedItems: Array<{ part_number: string; qty: number }> = [];
    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 100);
    for (const line of lines) {
      const parts = line.split(/[,\t\s]+/);
      const pn = normalize(String(parts[0]));
      const qty = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
      parsedItems.push({ part_number: pn, qty });
    }
    setPasteItems(parsedItems);
  };

  const validatePasteServer = async () => {
    if (pasteItems.length === 0) return;
    setProcessingPaste(true);
    try {
      const res = await fetch(`${API_BASE}/fast-order/bulk-validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: pasteItems }),
      });
      const json = await res.json();
      if (!res.ok) {
        toastError(json.error || "Validation failed");
      } else {
        setPasteValidated(json.processed as ValidatedItem[]);
        toastSuccess("Paste validation complete");
      }
    } catch {
      toastError("Server error");
    }
    setProcessingPaste(false);
  };

  const addPasteToCart = () => {
    let addedCount = 0;
    pasteValidated.forEach((b) => {
      if (b.product) {
        addToCart({
          id: b.product.id,
          name: b.product.name || b.product.part_number,
          price: b.product.price || 0,
          image: b.product.image || "/placeholder.png",
          quantity: b.qty,
        });
        addedCount += 1;
      }
    });
    if (addedCount > 0) toastSuccess("Added valid items to cart");
    else toastInfo("No valid items to add");
    resetPaste();
  };

  const removePasteValidatedItem = (index: number) => {
    setPasteValidated((prev) => prev.filter((_, i) => i !== index));
  };

  /* Save Paste as Quote */
  const savePasteAsQuote = async () => {
    if (pasteValidated.length === 0) {
      toastInfo("No validated items to save");
      return;
    }

    const validItems = pasteValidated.filter((b) => b.product);
    const removedCount = pasteValidated.length - validItems.length;

    if (validItems.length === 0) {
      toastInfo("No valid items to save as a quote");
      return;
    }

    try {
      const payloadItems = validItems.map((b) => ({
        product_id: b.product?.id || null,
        part_number: b.part_number,
        name: b.product?.name || null,
        price: b.product?.price ?? null,
        qty: b.qty,
        mapped_to: b.mapped_to || null,
      }));

      const res = await fetch(`${API_BASE}/quotes/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: clerkId,
          user_email: clerkEmail,
          name: `Quick Paste ${new Date().toISOString()}`,
          items: payloadItems,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toastError(json.error || "Failed to save quote");
        return;
      }

      if (removedCount > 0) {
        toastInfo(`${removedCount} invalid items were removed before saving.`);
      }

      toastSuccess(`Quote ${json.quote.quote_number} saved`);
      router.push("/quotes");
    } catch {
      toastError("Server error while saving quote");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-black">
        <h2 className="text-2xl font-semibold mb-4">
          Please log in to use Quick Order
        </h2>

        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Login to continue
          </button>
        </SignInButton>
      </div>
    );
  }
  /* ---------- UI ---------- */
  return (
    <div className="min-h-[80vh] bg-gray-50 py-8 text-black">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quick Order</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/cart")}
              className="bg-gray-100 px-3 py-1 rounded cursor-pointer"
            >
              View Cart
            </button>
            <button
              onClick={() => resetAll()}
              className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded cursor-pointer"
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm">
          <div className="">
            <nav className="flex gap-2 p-2">
              <button
                onClick={() => setTab("single")}
                className={`px-4 py-2 rounded ${
                  tab === "single"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent cursor-pointer"
                }`}
              >
                Quick Add
              </button>
              <button
                onClick={() => setTab("bulk")}
                className={`px-4 py-2 rounded ${
                  tab === "bulk"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent cursor-pointer"
                }`}
              >
                Bulk Upload
              </button>
              <button
                onClick={() => setTab("paste")}
                className={`px-4 py-2 rounded ${
                  tab === "paste"
                    ? "bg-blue-600 text-white"
                    : "bg-transparent cursor-pointer"
                }`}
              >
                Paste Part Numbers
              </button>
            </nav>
          </div>

          <div className="p-6">
            {tab === "single" && (
              <div>
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                  <input
                    value={singlePart}
                    onChange={(e) => setSinglePart(e.target.value)}
                    placeholder="Enter Part Number"
                    className="border p-2 rounded w-full md:flex-1"
                  />
                  <input
                    type="number"
                    min={1}
                    value={singleQty}
                    onChange={(e) =>
                      setSingleQty(parseInt(e.target.value, 10) || 1)
                    }
                    className="border p-2 rounded w-28"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSingleLookup}
                      disabled={!singlePart}
                      className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      {loadingSingle ? "Checking..." : "Lookup"}
                    </button>
                    <button
                      onClick={resetSingle}
                      className="bg-gray-200 px-3 py-2 rounded cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {singleResult && (
                  <div className="mt-4 border rounded p-4">
                    {singleResult.product ? (
                      <div className="flex items-center gap-4">
                        <Image
                          src={singleResult.product.image || "/placeholder.png"}
                          alt="product"
                          width={80}
                          height={80}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">
                            {singleResult.product.name ||
                              singleResult.product.part_number}
                          </div>
                          <div className="text-sm text-gray-600">
                            Part: {singleResult.product.part_number}
                          </div>
                          <div className="text-lg font-semibold">
                            ₹{singleResult.product.price || 0}
                          </div>
                          {singleResult.product.is_obsolete &&
                            singleResult.product.alternative_part_number && (
                              <div className="text-yellow-700 text-sm">
                                Obsolete — use{" "}
                                {singleResult.product.alternative_part_number}
                              </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={addSingleToCart}
                            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        Not Found: {singleResult.part_number}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {tab === "bulk" && (
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 bulk-upload-section">
                  <input
                    type="file"
                    accept=".csv"
                    placeholder="test"
                    onChange={(e) =>
                      handleFileSelect(e.target.files?.[0] || null)
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkParse}
                      disabled={!file}
                      className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      Parse
                    </button>
                    <button
                      onClick={resetBulk}
                      className="bg-gray-200 px-3 py-2 rounded cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {bulkPreview.length > 0 && (
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div className="text-sm text-gray-600">Preview:</div>
                    <pre className="text-xs">{bulkPreview.join("\n")}</pre>
                  </div>
                )}

                {bulkItems.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium">
                      Parsed items: {bulkItems.length}
                    </div>
                    <button
                      onClick={validateBulkServer}
                      className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer"
                    >
                      {processingBulk ? "Validating..." : "Validate & Show"}
                    </button>
                  </div>
                )}

                {bulkValidated.length > 0 && (
                  <div className="mt-4 space-y-3 max-h-64 overflow-y-auto border rounded p-2">
                    {bulkValidated.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 border-b last:border-b-0"
                      >
                        <div>
                          <div className="font-medium">
                            {b.product
                              ? b.product.name || b.product.part_number
                              : b.part_number}
                          </div>
                          <div className="text-sm">
                            {b.product ? (
                              <span className="text-gray-600">
                                ₹{b.product.price || 0} x {b.qty}
                              </span>
                            ) : (
                              <div className="text-red-600">Not found</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {b.product ? (
                            <button
                              onClick={() => {
                                addToCart({
                                  id: b.product!.id,
                                  name:
                                    b.product!.name || b.product!.part_number,
                                  price: b.product!.price || 0,
                                  image: b.product!.image || "/placeholder.png",
                                  quantity: b.qty,
                                });
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Add
                            </button>
                          ) : (
                            <button
                              onClick={() => removeBulkValidatedItem(i)}
                              className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={addBulkToCart}
                        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Add All Valid To Cart
                      </button>
                      <button
                        onClick={saveBulkAsQuote}
                        className="bg-amber-600 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Save as Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "paste" && (
              <div>
                <textarea
                  rows={7}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"PART_NUMBER, QTY\nPART_NUMBER, QTY"}
                  className="border p-2 rounded w-full"
                />

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={handlePasteParse}
                    className="bg-blue-600 text-white px-3 py-2 rounded cursor-pointer"
                  >
                    Parse
                  </button>
                  <button
                    onClick={validatePasteServer}
                    disabled={pasteItems.length === 0}
                    className="bg-indigo-600 text-white px-3 py-2 rounded cursor-pointer"
                  >
                    {processingPaste ? "Validating..." : "Validate"}
                  </button>
                  <button
                    onClick={resetPaste}
                    className="ml-2 bg-gray-200 px-3 py-2 rounded cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {pasteValidated.length > 0 && (
                  <div className="mt-4 space-y-3 max-h-64 overflow-y-auto border rounded p-2">
                    {pasteValidated.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 border-b last:border-b-0"
                      >
                        <div>
                          <div className="font-medium">
                            {b.product
                              ? b.product.name || b.product.part_number
                              : b.part_number}
                          </div>
                          <div className="text-sm">
                            {b.product ? (
                              <span className="text-gray-600">
                                ₹{b.product.price || 0} x {b.qty}
                              </span>
                            ) : (
                              <div className="text-red-600">Not found</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {b.product ? (
                            <button
                              onClick={() => {
                                addToCart({
                                  id: b.product!.id,
                                  name:
                                    b.product!.name || b.product!.part_number,
                                  price: b.product!.price || 0,
                                  image: b.product!.image || "/placeholder.png",
                                  quantity: b.qty,
                                });
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Add
                            </button>
                          ) : (
                            <button
                              onClick={() => removePasteValidatedItem(i)}
                              className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={addPasteToCart}
                        className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Add All Valid To Cart
                      </button>
                      <button
                        onClick={savePasteAsQuote}
                        className="bg-amber-600 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Save as Quote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
