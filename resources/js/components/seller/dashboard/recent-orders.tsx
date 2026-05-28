import React from 'react';
import { Order } from '../../../types/seller';
import { ChevronRight } from 'lucide-react';

interface RecentOrdersProps {
  orders: Order[];
}

const statusStyles = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
          <p className="text-sm text-muted-foreground">Latest 5 orders from customers</p>
        </div>
        <a
          href="#"
          className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Product
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Buyer
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-4">
                  <p className="font-medium text-foreground text-sm line-clamp-1">
                    {order.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-foreground text-sm">{order.buyer}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-foreground text-sm">
                    ${order.amount.toFixed(2)}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[order.status as keyof typeof statusStyles]
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
