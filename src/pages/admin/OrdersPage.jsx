import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  CircleAlert,
  X,
  Eye,
  ChevronDown,
  Filter,
  LayoutGrid,
  PackageCheck,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api`;

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "failed",
  "cancelled",
];

const ORDER_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "failed"],
  delivered: [],
  failed: ["cancelled"],
  cancelled: [],
};

const PAID_STATUSES = ["paid", "completed", "success", "successful"];

const PAYMENT_CONFIRMATION_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const INVALID_PAYMENT_ORDER_STATUSES = ["pending", "cancelled", "failed"];

const STATUS_STYLES = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  shipped: "border-violet-200 bg-violet-50 text-violet-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  failed: "border-orange-200 bg-orange-50 text-orange-700",
};

const STATUS_ICON_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  failed: "bg-orange-100 text-orange-700",
};

const STATUS_ICONS = {
  all: LayoutGrid,
  pending: Clock,
  confirmed: CheckCircle2,
  processing: PackageCheck,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
  failed: CircleAlert,
};

function normalizeStatus(status) {
  return String(status || "pending").trim().toLowerCase();
}

function getStatusIcon(status) {
  return STATUS_ICONS[String(status || "all").toLowerCase()] || ShoppingBag;
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrderId(order) {
  return order?._id || order?.id || "";
}

function getDisplayOrderNumber(order) {
  return (
    order?.orderNumber ||
    order?.order_number ||
    String(getOrderId(order)).slice(-8).toUpperCase()
  );
}

function getCustomerName(order) {
  const customer = order?.customer;

  if (typeof customer === "string") return customer;

  return (
    customer?.fullName ||
    customer?.name ||
    order?.customerName ||
    order?.name ||
    "Guest customer"
  );
}

function getCustomerEmail(order) {
  const customer = order?.customer;

  if (typeof customer === "object" && customer !== null) {
    return customer.email || order?.email || "—";
  }

  return order?.email || "—";
}

function getCustomerPhone(order) {
  const customer = order?.customer;

  if (typeof customer === "object" && customer !== null) {
    return customer.phone || customer.phoneNumber || order?.phone || "—";
  }

  return order?.phone || "—";
}

function getOrderTotal(order) {
  return Number(
    order?.total ??
      order?.totalAmount ??
      order?.amount ??
      order?.grandTotal ??
      0
  );
}

function getOrderNote(order) {
  const customer = order?.customer;

  const note =
    order?.note ??
    order?.orderNote ??
    order?.customerNote ??
    (customer && typeof customer === "object"
      ? customer.note ?? customer.orderNote
      : "") ??
    "";

  return typeof note === "string" ? note.trim() : "";
}

function getOrderItems(order) {
  if (Array.isArray(order?.items)) return order.items;
  if (Array.isArray(order?.products)) return order.products;
  return [];
}

function getItemName(item) {
  return item?.name || item?.productName || item?.product?.name || "Product";
}

function getItemQuantity(item) {
  return Number(item?.quantity ?? item?.qty ?? 1) || 1;
}

function getItemPrice(item) {
  return Number(item?.price ?? item?.unitPrice ?? item?.product?.price ?? 0);
}

function getStatusLabel(status) {
  const normalized = normalizeStatus(status);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);
  const Icon = getStatusIcon(normalized);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
        STATUS_STYLES[normalized] ||
        "border-[#E3D7D1] bg-[#F8F4EF] text-[#806C70]"
      }`}
    >
      <Icon size={13} strokeWidth={2} />
      {getStatusLabel(normalized)}
    </span>
  );
}

function StatusDropdown({
  value,
  onChange,
  filter = false,
  disabled = false,
  statuses,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const normalized = String(
    value || (filter ? "all" : "pending")
  ).toLowerCase();

  const Icon = getStatusIcon(normalized);
  const options = filter ? ["all", ...ORDER_STATUSES] : statuses || ORDER_STATUSES;

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedLabel =
    filter && normalized === "all" ? "All statuses" : getStatusLabel(normalized);

  return (
    <div
      ref={rootRef}
      className={`relative ${
        filter ? "w-full sm:w-[196px]" : "w-full min-w-[132px] max-w-[160px]"
      }`}
    >
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-[#FCFAF8] px-3 py-2.5 text-left text-xs text-[#493438] shadow-sm transition duration-200 hover:border-[#A66D78] hover:bg-[#F8EDEA] focus:outline-none focus:ring-2 focus:ring-[#A66D78]/20 disabled:cursor-wait disabled:opacity-60 ${
          open ? "border-[#A66D78] ring-2 ring-[#A66D78]/15" : "border-[#E3D7D1]"
        } ${filter ? "rounded-full py-3 pl-4 pr-3 text-sm" : ""}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {filter ? (
            <Filter size={15} className="shrink-0 text-[#806C70]" />
          ) : (
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                STATUS_ICON_STYLES[normalized] || "bg-[#F3E8E4] text-[#A66D78]"
              }`}
            >
              <Icon size={13} />
            </span>
          )}

          <span className="truncate">{selectedLabel}</span>
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-[#806C70] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={filter ? "Filter by status" : "Choose order status"}
          className={`absolute right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[#E8DCD6] bg-[#FFFCFA] p-2 shadow-[0_18px_45px_rgba(73,52,56,0.16)] ${
            filter ? "w-[220px]" : "w-[205px]"
          }`}
        >
          <p className="px-2 pb-2 pt-1 text-[11px] font-medium tracking-wide text-[#806C70]">
            {filter ? "Filter by status" : "Update order status"}
          </p>

          <div className="space-y-1">
            {options.map((option) => {
              const OptionIcon = getStatusIcon(option);
              const isSelected = normalized === option;
              const optionLabel =
                option === "all" ? "All statuses" : getStatusLabel(option);

              const optionStyle =
                option === "all"
                  ? "bg-[#F3E5E5] text-[#542D3A]"
                  : STATUS_STYLES[option] || "bg-[#F8F4EF] text-[#806C70]";

              const iconStyle =
                option === "all"
                  ? "bg-[#E8D3D7] text-[#542D3A]"
                  : STATUS_ICON_STYLES[option] || "bg-[#F3E8E4] text-[#A66D78]";

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition hover:brightness-[0.98] ${optionStyle} ${
                    isSelected ? "ring-1 ring-inset ring-[#A66D78]/25" : ""
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
                  >
                    <OptionIcon size={15} strokeWidth={1.9} />
                  </span>

                  <span className="flex-1 font-medium">{optionLabel}</span>

                  {isSelected && (
                    <CheckCircle2 size={14} className="shrink-0 opacity-75" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
function EmptyState({
  title,
  description,
  icon: Icon = ShoppingBag,
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3E8E4] text-[#A66D78]">
        <Icon size={25} />
      </div>
      <h3 className="mt-4 text-base font-medium text-[#493438]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#806C70]">
        {description}
      </p>
    </div>
  );
}

function getRawPaymentMethod(order) {
  const payment = order?.payment;

  const raw =
    (typeof payment === "string" ? payment : payment?.method) ||
    order?.paymentMethod ||
    order?.payment_method ||
    "";

  return String(raw).trim().toLowerCase();
}

function getPaymentMethod(order) {
  const normalized = getRawPaymentMethod(order);

  if (["cod", "cash_on_delivery", "cash on delivery"].includes(normalized)) {
    return "Cash on Delivery";
  }

  if (["instapay", "insta_pay", "insta pay"].includes(normalized)) {
    return "InstaPay";
  }

  return normalized ? normalized.replace(/_/g, " ") : "Not specified";
}

function getRawPaymentStatus(order) {
  return String(
    order?.paymentStatus ??
      order?.payment_status ??
      (typeof order?.payment === "object" ? order.payment?.status : "") ??
      ""
  )
    .trim()
    .toLowerCase();
}

function isOrderPaid(order) {
  return PAID_STATUSES.includes(getRawPaymentStatus(order));
}

function getPaymentStatus(order) {
  const raw = getRawPaymentStatus(order);
  const status = normalizeStatus(order?.status);
  const paid = PAID_STATUSES.includes(raw);

  if (paid && status === "cancelled") return "Paid — check refund";
  if (paid && ["pending", "failed"].includes(status)) return "Paid — check status";
  if (paid) return "Paid";

  if (["cash_on_delivery", "cod"].includes(raw)) return "Due on delivery";

  if (
    ["pending", "pending_payment", "unpaid", "awaiting_payment"].includes(raw)
  ) {
    return "Pending";
  }

  if (["failed", "rejected"].includes(raw)) return "Failed";
  if (["refunded", "refund"].includes(raw)) return "Refunded";

  return raw ? raw.replace(/_/g, " ") : "Not recorded";
}

function canConfirmPayment(order) {
  if (!order || isOrderPaid(order)) return false;

  const status = normalizeStatus(order.status);

  if (
    INVALID_PAYMENT_ORDER_STATUSES.includes(status) ||
    !PAYMENT_CONFIRMATION_STATUSES.includes(status)
  ) {
    return false;
  }

  const method = getRawPaymentMethod(order);

  if (["cod", "cash_on_delivery", "cash on delivery"].includes(method)) {
    return status === "delivered";
  }

  if (["instapay", "insta_pay", "insta pay"].includes(method)) {
    return true;
  }

  return false;
}

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const items = getOrderItems(order);
  const customer = order.customer;

  const address =
    typeof customer === "object" && customer !== null
      ? customer.address
      : order.address;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#34232B]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E3D7D1] bg-[#FCFAF8] shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-[#E3D7D1] bg-[#FCFAF8] px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#A66D78]">
              ORDER DETAILS
            </p>
            <h2 className="mt-2 break-all font-display text-2xl font-normal text-[#493438]">
              Order #{getDisplayOrderNumber(order)}
            </h2>
            <p className="mt-2 text-xs text-[#806C70]">
              {formatDate(order.createdAt || order.date)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-[#E3D7D1] bg-white p-2 text-[#806C70] transition hover:bg-[#F3E8E4]"
            aria-label="Close order details"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <section className="rounded-xl border border-[#E3D7D1] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#A18C8B]">Order status</p>
                <div className="mt-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#A18C8B]">Order total</p>
                <p className="mt-2 text-xl font-medium text-[#493438]">
                  {formatMoney(getOrderTotal(order))}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-[#493438]">
              Customer information
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["Name", getCustomerName(order)],
                ["Email", getCustomerEmail(order)],
                ["Phone", getCustomerPhone(order)],
                [
                  "Address",
                  typeof address === "string"
                    ? address
                    : address
                      ? JSON.stringify(address)
                      : "—",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#E3D7D1] bg-white p-4"
                >
                  <p className="text-xs text-[#A18C8B]">{label}</p>
                  <p className="mt-2 break-words text-sm text-[#493438]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {getOrderNote(order) && (
            <section className="rounded-xl border border-[#E3D7D1] bg-white p-4">
              <h3 className="text-sm font-medium text-[#493438]">Order note</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#806C70]">
                {getOrderNote(order)}
              </p>
            </section>
          )}

          <section>
            <h3 className="text-sm font-medium text-[#493438]">
              Ordered products ({items.length})
            </h3>
            {items.length ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[#E3D7D1] bg-white">
                {items.map((item, index) => (
                  <div
                    key={item?._id || item?.productId || index}
                    className="flex items-start justify-between gap-4 border-b border-[#F1EAE5] p-4 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium text-[#493438]">
                        {getItemName(item)}
                      </p>
                      <p className="mt-1 text-xs text-[#806C70]">
                        Quantity: {getItemQuantity(item)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-[#493438]">
                      {formatMoney(getItemPrice(item) * getItemQuantity(item))}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-[#E3D7D1] bg-white p-4 text-sm text-[#806C70]">
                No product details are available for this order.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-[#E3D7D1] bg-white p-4">
            <h3 className="text-sm font-medium text-[#493438]">
              Payment information
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#A18C8B]">Payment method</p>
                <p className="mt-1 text-sm font-medium text-[#493438]">
                  {getPaymentMethod(order)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#A18C8B]">Payment status</p>
                <p className="mt-1 text-sm font-medium text-[#493438]">
                  {getPaymentStatus(order)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PaymentConfirmationModal({ order, loading, onCancel, onConfirm }) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#493438]/35 p-4 backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nyora-payment-title"
        className="relative my-auto w-full max-w-[440px] overflow-hidden rounded-[30px] border border-[#EADBD5] bg-[#FCF9F5] shadow-[0_25px_90px_rgba(73,52,56,0.22)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-[30px] z-0 select-none text-[#B88C8C]/60"
        >
          <svg width="145" height="220" viewBox="0 0 145 220" fill="none">
            <path d="M130 210C115 167 103 120 87 70C80 48 72 29 63 10" stroke="currentColor" strokeWidth="1.1" />
            <path d="M112 163C83 153 67 135 67 116C90 121 109 138 112 163Z" fill="#DCC2BC" fillOpacity=".65" />
            <path d="M112 163C99 145 84 130 67 116" stroke="currentColor" strokeWidth=".8" />
            <path d="M101 128C122 112 129 94 120 78C103 90 96 108 101 128Z" fill="#E8D5CF" fillOpacity=".8" />
            <path d="M101 128C108 110 115 94 120 78" stroke="currentColor" strokeWidth=".8" />
            <path d="M84 88C56 79 42 62 45 43C68 51 81 68 84 88Z" fill="#DCC2BC" fillOpacity=".7" />
            <path d="M84 88C72 69 59 55 45 43" stroke="currentColor" strokeWidth=".8" />
            <path d="M74 60C91 43 95 27 85 13C70 27 66 44 74 60Z" fill="#E8D5CF" fillOpacity=".8" />
            <path d="M74 60C79 42 82 27 85 13" stroke="currentColor" strokeWidth=".8" />
          </svg>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close confirmation"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E9DAD4] bg-white/90 text-[#806C70] transition hover:border-[#A66D78] hover:bg-[#F3E5E2] disabled:opacity-50"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="relative z-10 px-6 pb-5 pt-8 text-center sm:px-8">
          <div className="relative mx-auto flex h-[112px] w-[112px] items-center justify-center rounded-full border border-[#E8D3D0]">
            <div className="absolute inset-[7px] rounded-full border border-[#F0E3DE]" />
            <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-gradient-to-br from-[#F2DFDA] via-[#E8CFCA] to-[#F8EEE7]">
              <svg width="47" height="47" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="15" width="30" height="23" rx="3" stroke="#542D3A" strokeWidth="1.7" />
                <path d="M13 15V10.5C13 8.6 14.6 7 16.5 7H33" stroke="#542D3A" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M32 7C35 7 37 9 37 12V15" stroke="#542D3A" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M30 23H40V31H30C27.8 31 26 29.2 26 27C26 24.8 27.8 23 30 23Z" fill="#F8F4EF" stroke="#542D3A" strokeWidth="1.5" />
                <circle cx="31" cy="27" r="1.5" fill="#A66D78" />
              </svg>
            </div>
            <span className="absolute -right-3 top-1/2 h-px w-5 bg-[#D9B6B5]" />
            <span className="absolute -left-2 top-[20px] text-lg text-[#C69A9D]">✦</span>
            <span className="absolute -left-4 top-[42px] text-xs text-[#C69A9D]">✦</span>
          </div>

          <p className="mt-5 text-[9px] font-medium tracking-[0.32em] text-[#A66D78]">
            NYORA BEAUTY
          </p>
          <h2 id="nyora-payment-title" className="mt-3 font-display text-[34px] font-normal leading-tight text-[#493438]">
            Confirm <span className="italic text-[#A66D78]">payment</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[310px] text-[13px] leading-5 text-[#806C70]">
            Please verify the payment before marking this order as paid.
          </p>
        </div>

        <div className="relative z-10 px-5 pb-6 sm:px-6">
          <div className="rounded-[19px] border border-[#EAD7D3] bg-white/90 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-medium tracking-[0.2em] text-[#A66D78]">
                  ORDER NUMBER
                </p>
                <p className="mt-2 break-all font-display text-[19px] font-normal text-[#493438]">
                  #{getDisplayOrderNumber(order)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#F5E5E5] px-3 py-1.5 text-[10px] font-medium text-[#A66D78]">
                {getPaymentMethod(order)}
              </span>
            </div>

            <div className="my-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-[#EADBD5]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#A66D78]" />
            </div>

            <p className="text-[9px] font-medium tracking-[0.2em] text-[#A66D78]">
              ORDER TOTAL
            </p>
            <p className="mt-1 font-display text-[28px] font-normal text-[#493438]">
              {formatMoney(getOrderTotal(order))}
            </p>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#F0D9D6] bg-[#F8E7E4] px-4 py-3.5">
            <CircleAlert size={23} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[#B94F58]" />
            <p className="text-[12px] leading-[1.65] text-[#6D454A]">
              Confirm only after you have actually received and verified the payment from the customer.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-full border border-[#B9858B] bg-transparent px-4 py-3 text-sm font-medium text-[#7A414B] transition hover:bg-[#F5E7E4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full bg-[#542D3A] px-3 py-3 text-sm font-medium text-white transition hover:bg-[#704553] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Confirming...
                </>
              ) : (
                "Confirm payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [updatingPaymentOrderId, setUpdatingPaymentOrderId] = useState("");
  const [notice, setNotice] = useState("");
  const [paymentConfirmationOrder, setPaymentConfirmationOrder] = useState(null);

  const token = sessionStorage.getItem("nyoraAdminToken");

  const loadOrders = useCallback(
    async ({ silent = false } = {}) => {
      if (!token) {
        setError("Your admin session has expired. Please log in again.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
        setError("");
      }

      try {
        const response = await fetch(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("nyoraAdminToken");
          sessionStorage.removeItem("nyoraAdmin");
          setError("Your admin session has expired. Please log in again.");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load orders.");
        }

        const fetchedOrders = Array.isArray(result.data) ? result.data : [];
        setOrders(fetchedOrders);

        setSelectedOrder((current) => {
          if (!current) return current;
          return (
            fetchedOrders.find(
              (order) => getOrderId(order) === getOrderId(current)
            ) || current
          );
        });

        setPaymentConfirmationOrder((current) => {
          if (!current) return current;

          const latestOrder = fetchedOrders.find(
            (order) => getOrderId(order) === getOrderId(current)
          );

          if (!latestOrder || !canConfirmPayment(latestOrder)) return null;
          return latestOrder;
        });

        setError("");
      } catch (loadError) {
        setError(
          loadError.message === "Failed to fetch"
            ? "Cannot connect to the backend. Check that your server is running."
            : loadError.message
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadOrders();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadOrders({ silent: true });
      }
    }, 15000);

    const handleFocus = () => loadOrders({ silent: true });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadOrders({ silent: true });
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadOrders]);

  async function updateOrderStatus(orderId, nextStatus) {
    if (!ORDER_STATUSES.includes(nextStatus)) {
      setNotice("Invalid order status.");
      return;
    }

    const previousOrder = orders.find((order) => getOrderId(order) === orderId);

    if (!previousOrder || normalizeStatus(previousOrder.status) === nextStatus) {
      return;
    }

    const currentStatus = normalizeStatus(previousOrder.status);
    const allowedTransitions = ORDER_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(nextStatus)) {
      setNotice(`You cannot change an order from ${currentStatus} to ${nextStatus}.`);
      return;
    }

    if (nextStatus === "cancelled" && isOrderPaid(previousOrder)) {
      setNotice(
        "This order is already marked as paid. Record and process any required refund before cancelling it."
      );
      return;
    }

    setUpdatingOrderId(orderId);
    setNotice("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("nyoraAdminToken");
        sessionStorage.removeItem("nyoraAdmin");
        throw new Error("Your admin session has expired. Please log in again.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update order status.");
      }

      const updatedOrder = result.data || {
        ...previousOrder,
        status: nextStatus,
      };

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          getOrderId(order) === orderId
            ? {
                ...order,
                ...updatedOrder,
                status: updatedOrder.status || nextStatus,
              }
            : order
        )
      );

      setSelectedOrder((currentOrder) =>
        currentOrder && getOrderId(currentOrder) === orderId
          ? {
              ...currentOrder,
              ...updatedOrder,
              status: updatedOrder.status || nextStatus,
            }
          : currentOrder
      );

      setPaymentConfirmationOrder((currentOrder) =>
        currentOrder && getOrderId(currentOrder) === orderId
          ? null
          : currentOrder
      );

      setNotice(
        `Order status updated to ${getStatusLabel(nextStatus)} successfully.`
      );

      window.dispatchEvent(new Event("nyora:orders-updated"));
      await loadOrders({ silent: true });
    } catch (updateError) {
      setError(updateError.message || "Could not update order status.");
    } finally {
      setUpdatingOrderId("");
    }
  }

  function confirmOrderPayment(orderId) {
    const order = orders.find((item) => getOrderId(item) === orderId);

    if (!order || !canConfirmPayment(order)) {
      setNotice("Payment cannot be confirmed for this order in its current state.");
      return;
    }

    setPaymentConfirmationOrder(order);
  }

  async function handleConfirmPayment() {
    const order = paymentConfirmationOrder;
    if (!order) return;

    const orderId = getOrderId(order);
    const latestOrder = orders.find((item) => getOrderId(item) === orderId);

    if (!latestOrder || !canConfirmPayment(latestOrder)) {
      setPaymentConfirmationOrder(null);
      setNotice(
        "This order is no longer eligible for payment confirmation. Refresh the order list."
      );
      return;
    }

    setUpdatingPaymentOrderId(orderId);
    setNotice("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: "paid" }),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("nyoraAdminToken");
        sessionStorage.removeItem("nyoraAdmin");
        throw new Error("Your admin session has expired. Please log in again.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not confirm payment.");
      }

      const updatedOrder = result.data || {
        ...latestOrder,
        paymentStatus: "paid",
      };

      setOrders((current) =>
        current.map((item) =>
          getOrderId(item) === orderId ? { ...item, ...updatedOrder } : item
        )
      );

      setSelectedOrder((current) =>
        current && getOrderId(current) === orderId
          ? { ...current, ...updatedOrder }
          : current
      );

      setNotice(
        `Payment confirmed for order #${getDisplayOrderNumber(updatedOrder)}.`
      );

      setPaymentConfirmationOrder(null);
      window.dispatchEvent(new Event("nyora:orders-updated"));
      await loadOrders({ silent: true });
    } catch (paymentError) {
      setError(paymentError.message || "Could not confirm payment.");
    } finally {
      setUpdatingPaymentOrderId("");
    }
  }

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const status = normalizeStatus(order.status);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const searchableValues = [
        getOrderId(order),
        getDisplayOrderNumber(order),
        getCustomerName(order),
        getCustomerEmail(order),
        getCustomerPhone(order),
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const orderCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      failed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = normalizeStatus(order.status);

      if (status === "completed") {
        counts.delivered += 1;
      } else if (Object.prototype.hasOwnProperty.call(counts, status)) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [orders]);

  if (loading) {
    return (
      <section>
        <p className="text-xs tracking-[0.18em] text-[#A66D78]">
          STORE MANAGEMENT
        </p>
        <h1 className="mt-2 font-display text-4xl font-normal text-[#493438]">
          Orders
        </h1>
        <div className="mt-7 rounded-2xl border border-[#E3D7D1] bg-white">
          <EmptyState
            icon={ShoppingBag}
            title="Loading orders"
            description="Fetching orders saved in your database..."
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.18em] text-[#A66D78]">
            STORE MANAGEMENT
          </p>
          <h1 className="mt-2 font-display text-4xl font-normal text-[#493438]">
            Orders
          </h1>
          <p className="mt-3 text-sm text-[#806C70]">
            View orders, check customer details, and manage order status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOrders()}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-3 text-sm text-[#493438] transition hover:bg-[#EDE3DD] disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh orders
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <CircleAlert size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Orders error</p>
            <p className="mt-1">{error}</p>
            <button onClick={() => loadOrders()} className="mt-2 underline">
              Try again
            </button>
          </div>
        </div>
      )}

      {notice && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{notice}</p>
          <button
            onClick={() => setNotice("")}
            className="ml-auto shrink-0"
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-8">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl border p-4 text-left transition ${
            statusFilter === "all"
              ? "border-[#542D3A] bg-[#542D3A] text-white"
              : "border-[#E3D7D1] bg-white text-[#493438] hover:bg-[#FCFAF8]"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs opacity-80">All orders</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8D3D7] text-[#542D3A]">
              <ShoppingBag size={16} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-medium">{orderCounts.all}</p>
        </button>

        {[
          ["pending", Clock],
          ["confirmed", CheckCircle2],
          ["processing", PackageCheck],
          ["shipped", Truck],
          ["delivered", CheckCircle2],
          ["failed", CircleAlert],
          ["cancelled", XCircle],
        ].map(([status, Icon]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-xl border p-4 text-left transition ${
              statusFilter === status
                ? "border-[#542D3A] bg-[#542D3A] text-white"
                : "border-[#E3D7D1] bg-white text-[#493438] hover:bg-[#FCFAF8]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs capitalize opacity-80">{status}</p>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${STATUS_ICON_STYLES[status]}`}
              >
                <Icon size={16} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-medium">{orderCounts[status]}</p>
          </button>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-4 py-3">
          <Search size={17} className="shrink-0 text-[#A18C8B]" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by order ID, customer, email, or phone..."
            className="w-full !border-0 !outline-none !ring-0 !shadow-none bg-transparent text-sm text-[#493438] placeholder:text-[#B5A4A0] focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none"
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-[#A18C8B] hover:text-[#493438]"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <StatusDropdown value={statusFilter} onChange={setStatusFilter} filter />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#E3D7D1] bg-white">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={orders.length ? "No matching orders" : "No orders yet"}
            description={
              orders.length
                ? "Try changing the search term or status filter."
                : "New customer orders will appear here after they are saved in the database."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1160px] text-left">
              <thead>
                <tr className="bg-[#FCFAF8] text-[11px] uppercase tracking-wider text-[#A18C8B]">
                  <th className="px-5 py-4 font-medium">Order</th>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Items</th>
                  <th className="px-5 py-4 font-medium">Total</th>
                  <th className="px-5 py-4 font-medium">Payment</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Update status</th>
                  <th className="px-5 py-4 font-medium">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const orderId = getOrderId(order);
                  const currentStatus = normalizeStatus(order.status);
                  const items = getOrderItems(order);
                  const paymentCanBeConfirmed = canConfirmPayment(order);

                  const showPaymentReceived =
                    isOrderPaid(order) &&
                    !INVALID_PAYMENT_ORDER_STATUSES.includes(currentStatus) &&
                    PAYMENT_CONFIRMATION_STATUSES.includes(currentStatus);

                  const availableTransitions = ORDER_TRANSITIONS[currentStatus] || [];

                  return (
                    <tr
                      key={orderId}
                      className="border-t border-[#F1EAE5] transition hover:bg-[#FCFAF8]"
                    >
                      <td className="px-5 py-4">
                        <span className="font-medium text-[#493438]">
                          #{getDisplayOrderNumber(order)}
                        </span>
                      </td>

                      <td className="max-w-56 px-5 py-4">
                        <p className="truncate text-sm font-medium text-[#493438]">
                          {getCustomerName(order)}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#806C70]">
                          {getCustomerEmail(order)}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#806C70]">
                        {formatDate(order.createdAt || order.date)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#806C70]">
                        {items.reduce((sum, item) => sum + getItemQuantity(item), 0)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[#493438]">
                        {formatMoney(getOrderTotal(order))}
                      </td>

                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap text-xs text-[#806C70]">
                          {getPaymentMethod(order)}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-[11px] text-[#A66D78]">
                          {getPaymentStatus(order)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={currentStatus} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusDropdown
                          value={currentStatus}
                          statuses={[currentStatus, ...availableTransitions]}
                          onChange={(nextStatus) => updateOrderStatus(orderId, nextStatus)}
                          disabled={
                            updatingOrderId === orderId ||
                            availableTransitions.length === 0
                          }
                        />

                        {paymentCanBeConfirmed && (
                          <button
                            type="button"
                            onClick={() => confirmOrderPayment(orderId)}
                            disabled={updatingPaymentOrderId === orderId}
                            className="mt-2 block whitespace-nowrap rounded-full border border-[#D9C1C7] bg-[#F8EDEA] px-3 py-2 text-xs font-medium text-[#7A414B] transition hover:bg-[#F2E1E1] disabled:cursor-wait disabled:opacity-60"
                          >
                            {updatingPaymentOrderId === orderId
                              ? "Confirming..."
                              : "Confirm payment"}
                          </button>
                        )}

                        {showPaymentReceived && (
                          <p className="mt-2 text-xs font-medium text-emerald-700">
                            Payment received
                          </p>
                        )}

                        {updatingOrderId === orderId && (
                          <p className="mt-1 text-[10px] text-[#A66D78]">
                            Updating...
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#E3D7D1] bg-white px-3 py-2 text-xs text-[#806C70] transition hover:bg-[#F3E8E4] hover:text-[#493438]"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F1EAE5] px-5 py-4">
          <p className="text-xs text-[#806C70]">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>

          <button
            onClick={() => loadOrders({ silent: true })}
            disabled={refreshing}
            className="inline-flex items-center gap-2 text-xs text-[#A66D78] transition hover:text-[#542D3A] disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh list"}
          </button>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {paymentConfirmationOrder && (
        <PaymentConfirmationModal
          order={paymentConfirmationOrder}
          loading={updatingPaymentOrderId === getOrderId(paymentConfirmationOrder)}
          onCancel={() => {
            if (updatingPaymentOrderId) return;
            setPaymentConfirmationOrder(null);
          }}
          onConfirm={handleConfirmPayment}
        />
      )}
    </section>
  );
}