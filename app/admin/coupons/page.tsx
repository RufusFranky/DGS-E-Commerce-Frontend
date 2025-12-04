'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { DeleteIcon } from "lucide-react";
import { couponDummyData } from "@/utils/asset";

interface Coupon {
  code: string;
  description: string;
  discount: number;
  expiresAt: Date | string;
  forNewUser: boolean;
  forMember: boolean;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: '',
    description: '',
    discount: 0,
    forNewUser: false,
    forMember: false,
    expiresAt: new Date(),
  });

  // Load Dummy Data
  const fetchCoupons = () => {
    setCoupons(couponDummyData as Coupon[]);
  };

  // Input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  // Add coupon
  const handleAddCoupon = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const couponToAdd: Coupon = {
          ...newCoupon,
          discount: Number(newCoupon.discount),
          expiresAt: new Date(newCoupon.expiresAt),
        };

        setCoupons((prev) => [...prev, couponToAdd]);

        setNewCoupon({
          code: '',
          description: '',
          discount: 0,
          forNewUser: false,
          forMember: false,
          expiresAt: new Date(),
        });

        resolve("done");
      }, 700);
    });
  };

  // Delete coupon
  const deleteCoupon = async (code: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCoupons((prev) => prev.filter((c) => c.code !== code));
        resolve("deleted");
      }, 700);
    });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="text-slate-500 mb-40">
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          toast.promise(handleAddCoupon(), {
            loading: "Adding coupon...",
            success: "Coupon added!",
            error: "Failed",
          });
        }}
        className="max-w-sm text-sm"
      >
        <h2 className="text-2xl">Add <span className="text-slate-800 font-medium">Coupons</span></h2>

        <div className="flex gap-2 max-sm:flex-col mt-2">
          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={handleChange}
            required
            className="w-full mt-2 p-2 border border-slate-200 rounded-md"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={newCoupon.discount}
            onChange={handleChange}
            min={1}
            max={100}
            required
            className="w-full mt-2 p-2 border border-slate-200 rounded-md"
          />
        </div>

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newCoupon.description}
          onChange={handleChange}
          required
          className="w-full mt-2 p-2 border border-slate-200 rounded-md"
        />

        <label>
          <p className="mt-3">Coupon Expiry Date</p>
          <input
            type="date"
            name="expiresAt"
            value={format(new Date(newCoupon.expiresAt), "yyyy-MM-dd")}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-slate-200 rounded-md"
          />
        </label>

        <div className="mt-5">
          <div className="flex gap-2 mt-3">
            <input
              type="checkbox"
              checked={newCoupon.forNewUser}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })
              }
            />
            <p>For New User</p>
          </div>

          <div className="flex gap-2 mt-3">
            <input
              type="checkbox"
              checked={newCoupon.forMember}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, forMember: e.target.checked })
              }
            />
            <p>For Member</p>
          </div>
        </div>

        <button className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition">
          Add Coupon
        </button>
      </form>

      {/* List */}
      <div className="mt-14">
        <h2 className="text-2xl">List <span className="text-slate-800 font-medium">Coupons</span></h2>

        <div className="overflow-x-auto mt-4 rounded-lg border border-slate-200 max-w-4xl">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Expires At</th>
                <th className="py-3 px-4">New User</th>
                <th className="py-3 px-4">For Member</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {coupons.map((coupon) => (
                <tr key={coupon.code}>
                  <td className="py-3 px-4">{coupon.code}</td>
                  <td className="py-3 px-4">{coupon.description}</td>
                  <td className="py-3 px-4">{coupon.discount}%</td>
                  <td className="py-3 px-4">
                    {format(new Date(coupon.expiresAt), "yyyy-MM-dd")}
                  </td>
                  <td className="py-3 px-4">{coupon.forNewUser ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">{coupon.forMember ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">
                    <DeleteIcon
                      onClick={() =>
                        toast.promise(deleteCoupon(coupon.code), {
                          loading: "Deleting...",
                          success: "Deleted!",
                          error: "Failed",
                        })
                      }
                      className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
