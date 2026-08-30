"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Download,
  ExternalLink,
  Eye,
  Headphones,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Tags,
  Users,
  WalletCards,
  Warehouse,
  X,
} from "lucide-react";
import { AIHubLogo } from "@/components/aihub-logo";
import { useAuth } from "@/components/auth/auth-provider";
import { roleLabels } from "@/lib/api/auth";
import styles from "./admin.module.css";

export type AdminSection =
  | "overview"
  | "orders"
  | "products"
  | "inventory"
  | "customers"
  | "transactions"
  | "deposits"
  | "categories"
  | "promotions"
  | "content"
  | "support"
  | "reports"
  | "settings";

type ModuleId = AdminSection;

type DataRow = Record<string, string> & { id: string };

type AdminNotification = {
  id: string;
  title: string;
  description: string;
  time: string;
  section: ModuleId;
  icon: LucideIcon;
  tone: "cyan" | "blue" | "green" | "amber" | "danger";
  unread: boolean;
};

type ModuleDefinition = {
  title: string;
  description: string;
  icon: LucideIcon;
  createLabel?: string;
  columns: { key: string; label: string }[];
  rows: DataRow[];
};

const navGroups: { label: string; items: { id: ModuleId; label: string; icon: LucideIcon; badge?: string }[] }[] = [
  {
    label: "Tổng quan",
    items: [{ id: "overview", label: "Bảng điều khiển", icon: LayoutDashboard }],
  },
  {
    label: "Vận hành",
    items: [
      { id: "orders", label: "Đơn hàng", icon: ShoppingCart, badge: "18" },
      { id: "products", label: "Sản phẩm", icon: Package },
      { id: "inventory", label: "Kho hàng", icon: Warehouse, badge: "5" },
    ],
  },
  {
    label: "Tài khoản",
    items: [
      { id: "customers", label: "Khách hàng", icon: Users },
    ],
  },
  {
    label: "Tài chính",
    items: [
      { id: "transactions", label: "Giao dịch", icon: WalletCards },
      { id: "deposits", label: "Nạp & rút tiền", icon: CircleDollarSign, badge: "7" },
    ],
  },
  {
    label: "Tăng trưởng",
    items: [
      { id: "categories", label: "Danh mục", icon: Tags },
      { id: "promotions", label: "Khuyến mãi", icon: Megaphone },
      { id: "content", label: "Nội dung", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { id: "support", label: "Hỗ trợ", icon: Headphones, badge: "9" },
      { id: "reports", label: "Báo cáo", icon: BarChart3 },
      { id: "settings", label: "Cài đặt", icon: Settings },
    ],
  },
];

const moduleDefinitions: Record<Exclude<ModuleId, "overview">, ModuleDefinition> = {
  orders: {
    title: "Quản lý đơn hàng",
    description: "Theo dõi, duyệt và xử lý toàn bộ đơn hàng trên hệ thống.",
    icon: ShoppingCart,
    columns: [
      { key: "id", label: "Mã đơn" },
      { key: "customer", label: "Khách hàng" },
      { key: "product", label: "Sản phẩm" },
      { key: "value", label: "Giá trị" },
      { key: "status", label: "Trạng thái" },
      { key: "date", label: "Thời gian" },
    ],
    rows: [
      { id: "#AH10428", customer: "Nguyễn Minh Anh", product: "ChatGPT Plus - 1 tháng", value: "450.000đ", status: "Hoàn tất", date: "10 phút trước" },
      { id: "#AH10427", customer: "Trần Quốc Huy", product: "Gemini Pro 5TB", value: "89.000đ", status: "Đang xử lý", date: "18 phút trước" },
      { id: "#AH10426", customer: "Phạm Thu Trang", product: "Canva Pro EDU", value: "25.000đ", status: "Chờ thanh toán", date: "35 phút trước" },
      { id: "#AH10425", customer: "Lê Hoàng Nam", product: "Proxy dân cư Việt Nam", value: "320.000đ", status: "Hoàn tất", date: "1 giờ trước" },
      { id: "#AH10424", customer: "Vũ Anh Tuấn", product: "Facebook Clone VIA", value: "170.000đ", status: "Đã hủy", date: "2 giờ trước" },
      { id: "#AH10423", customer: "Đặng Gia Bảo", product: "VPS Việt Nam NVMe", value: "240.000đ", status: "Hoàn tiền", date: "3 giờ trước" },
    ],
  },
  products: {
    title: "Quản lý sản phẩm",
    description: "Cập nhật sản phẩm, giá bán, phân loại và trạng thái hiển thị.",
    icon: Package,
    createLabel: "Thêm sản phẩm",
    columns: [
      { key: "id", label: "Mã SP" },
      { key: "name", label: "Tên sản phẩm" },
      { key: "category", label: "Danh mục" },
      { key: "price", label: "Giá bán" },
      { key: "stock", label: "Tồn kho" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "SP-1024", name: "ChatGPT Plus - tài khoản riêng", category: "Tài khoản", price: "450.000đ", stock: "128", status: "Đang bán" },
      { id: "SP-1023", name: "Gemini Pro 5TB", category: "Tài khoản", price: "89.000đ", stock: "8", status: "Sắp hết" },
      { id: "SP-1022", name: "Canva Pro EDU", category: "Phần mềm", price: "25.000đ", stock: "309", status: "Đang bán" },
      { id: "SP-1021", name: "Proxy dân cư Việt Nam", category: "Proxy & VPN", price: "80.000đ", stock: "0", status: "Hết hàng" },
      { id: "SP-1020", name: "VPS Việt Nam NVMe", category: "VPS", price: "120.000đ", stock: "42", status: "Đang bán" },
    ],
  },
  inventory: {
    title: "Quản lý kho hàng",
    description: "Kiểm soát tài nguyên số, số lượng khả dụng và ngưỡng cảnh báo.",
    icon: Warehouse,
    createLabel: "Nhập kho",
    columns: [
      { key: "id", label: "SKU" },
      { key: "name", label: "Sản phẩm" },
      { key: "available", label: "Khả dụng" },
      { key: "reserved", label: "Đang giữ" },
      { key: "updated", label: "Cập nhật" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "SKU-GPT-01", name: "ChatGPT Plus - 1 tháng", available: "128", reserved: "12", updated: "5 phút trước", status: "Ổn định" },
      { id: "SKU-GEM-05", name: "Gemini Pro 5TB", available: "8", reserved: "4", updated: "12 phút trước", status: "Sắp hết" },
      { id: "SKU-PROXY-VN", name: "Proxy dân cư Việt Nam", available: "0", reserved: "0", updated: "1 giờ trước", status: "Hết hàng" },
      { id: "SKU-CANVA-EDU", name: "Canva Pro EDU", available: "309", reserved: "18", updated: "2 giờ trước", status: "Ổn định" },
    ],
  },
  customers: {
    title: "Quản lý khách hàng",
    description: "Tra cứu tài khoản, lịch sử mua hàng và trạng thái người dùng.",
    icon: Users,
    createLabel: "Thêm khách hàng",
    columns: [
      { key: "id", label: "Mã KH" },
      { key: "name", label: "Khách hàng" },
      { key: "email", label: "Email" },
      { key: "orders", label: "Đơn hàng" },
      { key: "spend", label: "Tổng chi" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "KH-8821", name: "Nguyễn Minh Anh", email: "minhanh@example.com", orders: "24", spend: "8.240.000đ", status: "Hoạt động" },
      { id: "KH-8820", name: "Trần Quốc Huy", email: "quochuy@example.com", orders: "11", spend: "2.980.000đ", status: "Hoạt động" },
      { id: "KH-8819", name: "Phạm Thu Trang", email: "thutrang@example.com", orders: "3", spend: "425.000đ", status: "Mới" },
      { id: "KH-8818", name: "Lê Hoàng Nam", email: "hoangnam@example.com", orders: "18", spend: "6.150.000đ", status: "Tạm khóa" },
    ],
  },
  transactions: {
    title: "Quản lý giao dịch",
    description: "Đối soát dòng tiền, thanh toán đơn hàng và hoàn tiền.",
    icon: WalletCards,
    columns: [
      { key: "id", label: "Mã GD" },
      { key: "type", label: "Loại" },
      { key: "account", label: "Tài khoản" },
      { key: "value", label: "Số tiền" },
      { key: "method", label: "Phương thức" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "GD-722981", type: "Thanh toán", account: "Nguyễn Minh Anh", value: "+450.000đ", method: "Số dư AIHUB", status: "Thành công" },
      { id: "GD-722980", type: "Nạp tiền", account: "Trần Quốc Huy", value: "+1.000.000đ", method: "Chuyển khoản", status: "Thành công" },
      { id: "GD-722979", type: "Hoàn tiền", account: "Đặng Gia Bảo", value: "-240.000đ", method: "Số dư AIHUB", status: "Đang xử lý" },
      { id: "GD-722978", type: "Thanh toán", account: "Phạm Thu Trang", value: "+25.000đ", method: "Số dư AIHUB", status: "Thành công" },
    ],
  },
  deposits: {
    title: "Nạp & rút tiền",
    description: "Phê duyệt yêu cầu nạp, rút và kiểm tra chênh lệch số dư.",
    icon: CircleDollarSign,
    columns: [
      { key: "id", label: "Yêu cầu" },
      { key: "account", label: "Tài khoản" },
      { key: "type", label: "Loại" },
      { key: "value", label: "Số tiền" },
      { key: "created", label: "Thời gian" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "YC-3912", account: "@minhanh", type: "Nạp tiền", value: "2.000.000đ", created: "8 phút trước", status: "Chờ duyệt" },
      { id: "YC-3911", account: "@hoangnam", type: "Rút tiền", value: "800.000đ", created: "22 phút trước", status: "Đang xử lý" },
      { id: "YC-3910", account: "@thutrang", type: "Rút tiền", value: "300.000đ", created: "45 phút trước", status: "Hoàn tất" },
      { id: "YC-3909", account: "@quochuy", type: "Nạp tiền", value: "1.000.000đ", created: "1 giờ trước", status: "Hoàn tất" },
    ],
  },
  categories: {
    title: "Quản lý danh mục",
    description: "Tổ chức nhóm sản phẩm và cấu hình thứ tự hiển thị cửa hàng.",
    icon: Tags,
    createLabel: "Thêm danh mục",
    columns: [
      { key: "id", label: "Mã" },
      { key: "name", label: "Danh mục" },
      { key: "products", label: "Sản phẩm" },
      { key: "revenue", label: "Doanh thu tháng" },
      { key: "order", label: "Thứ tự" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "DM-01", name: "Tài khoản", products: "68", revenue: "124.500.000đ", order: "01", status: "Hiển thị" },
      { id: "DM-02", name: "Phần mềm", products: "42", revenue: "72.800.000đ", order: "02", status: "Hiển thị" },
      { id: "DM-03", name: "Proxy & VPN", products: "21", revenue: "38.200.000đ", order: "03", status: "Hiển thị" },
      { id: "DM-04", name: "VPS", products: "17", revenue: "29.600.000đ", order: "04", status: "Ẩn" },
    ],
  },
  promotions: {
    title: "Quản lý khuyến mãi",
    description: "Tạo mã giảm giá, giới hạn sử dụng và lịch chạy chiến dịch.",
    icon: Megaphone,
    createLabel: "Tạo khuyến mãi",
    columns: [
      { key: "id", label: "Chiến dịch" },
      { key: "code", label: "Mã" },
      { key: "discount", label: "Ưu đãi" },
      { key: "uses", label: "Lượt dùng" },
      { key: "end", label: "Kết thúc" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "Khách hàng mới", code: "AIHUB10", discount: "10%", uses: "284 / 500", end: "31/08/2026", status: "Đang chạy" },
      { id: "Cuối tuần vui vẻ", code: "WEEKEND50", discount: "50.000đ", uses: "92 / 200", end: "18/08/2026", status: "Đang chạy" },
      { id: "Sinh nhật AIHUB", code: "AIHUB15", discount: "15%", uses: "0 / 300", end: "25/08/2026", status: "Đã lên lịch" },
      { id: "Mùa hè AI", code: "SUMMERAI", discount: "15%", uses: "500 / 500", end: "31/07/2026", status: "Đã kết thúc" },
    ],
  },
  content: {
    title: "Quản lý nội dung",
    description: "Điều chỉnh banner, thông báo và nội dung hỗ trợ trên cửa hàng.",
    icon: SlidersHorizontal,
    createLabel: "Tạo nội dung",
    columns: [
      { key: "id", label: "Mã" },
      { key: "title", label: "Nội dung" },
      { key: "channel", label: "Vị trí" },
      { key: "updated", label: "Cập nhật" },
      { key: "owner", label: "Người sửa" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "ND-128", title: "Banner AIHUB tháng 8", channel: "Trang chủ", updated: "15/08/2026", owner: "Admin", status: "Đang hiển thị" },
      { id: "ND-127", title: "Thông báo bảo trì thanh toán", channel: "Toàn hệ thống", updated: "14/08/2026", owner: "Minh Anh", status: "Bản nháp" },
      { id: "ND-126", title: "Hướng dẫn quỹ bảo hiểm 72h", channel: "Trung tâm trợ giúp", updated: "12/08/2026", owner: "Thu Trang", status: "Đang hiển thị" },
    ],
  },
  support: {
    title: "Trung tâm hỗ trợ",
    description: "Tiếp nhận khiếu nại, yêu cầu hỗ trợ và tranh chấp giao dịch.",
    icon: Headphones,
    columns: [
      { key: "id", label: "Mã phiếu" },
      { key: "customer", label: "Khách hàng" },
      { key: "subject", label: "Nội dung" },
      { key: "priority", label: "Ưu tiên" },
      { key: "updated", label: "Cập nhật" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "TK-9201", customer: "Nguyễn Minh Anh", subject: "Chưa nhận được tài khoản", priority: "Cao", updated: "5 phút trước", status: "Đang xử lý" },
      { id: "TK-9200", customer: "Trần Quốc Huy", subject: "Yêu cầu đổi sản phẩm", priority: "Trung bình", updated: "18 phút trước", status: "Mới" },
      { id: "TK-9199", customer: "Phạm Thu Trang", subject: "Không đăng nhập được", priority: "Cao", updated: "42 phút trước", status: "Chờ phản hồi" },
      { id: "TK-9198", customer: "Lê Hoàng Nam", subject: "Hỏi về hoàn tiền", priority: "Thấp", updated: "1 giờ trước", status: "Đã đóng" },
    ],
  },
  reports: {
    title: "Báo cáo & phân tích",
    description: "Tổng hợp chỉ số kinh doanh, vận hành và chất lượng dịch vụ.",
    icon: BarChart3,
    createLabel: "Tạo báo cáo",
    columns: [
      { key: "id", label: "Báo cáo" },
      { key: "period", label: "Kỳ dữ liệu" },
      { key: "owner", label: "Người tạo" },
      { key: "updated", label: "Cập nhật" },
      { key: "format", label: "Định dạng" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "Doanh thu theo sản phẩm", period: "Tháng 08/2026", owner: "Admin", updated: "Hôm nay", format: "Excel", status: "Sẵn sàng" },
      { id: "Doanh thu theo danh mục", period: "Quý 3/2026", owner: "Minh Anh", updated: "Hôm qua", format: "PDF", status: "Sẵn sàng" },
      { id: "Tỷ lệ hoàn tiền", period: "30 ngày gần nhất", owner: "Hệ thống", updated: "2 giờ trước", format: "Dashboard", status: "Đang tạo" },
    ],
  },
  settings: {
    title: "Cài đặt hệ thống",
    description: "Quản lý cấu hình cửa hàng, phân quyền và các tích hợp.",
    icon: Settings,
    columns: [
      { key: "id", label: "Nhóm cài đặt" },
      { key: "description", label: "Mô tả" },
      { key: "owner", label: "Phụ trách" },
      { key: "updated", label: "Cập nhật" },
      { key: "status", label: "Trạng thái" },
    ],
    rows: [
      { id: "Thông tin cửa hàng", description: "Tên, logo, tên miền và thông tin liên hệ", owner: "Quản trị viên", updated: "12/08/2026", status: "Đã cấu hình" },
      { id: "Thanh toán", description: "Ngân hàng, đối soát và giới hạn giao dịch", owner: "Tài chính", updated: "10/08/2026", status: "Đã cấu hình" },
      { id: "Vai trò & phân quyền", description: "Quyền truy cập của nhân sự quản trị", owner: "Quản trị viên", updated: "08/08/2026", status: "Cần kiểm tra" },
      { id: "Thông báo", description: "Email, trình duyệt và cảnh báo vận hành", owner: "Vận hành", updated: "01/08/2026", status: "Đã cấu hình" },
      { id: "API & tích hợp", description: "Webhook, API token và dịch vụ bên thứ ba", owner: "Kỹ thuật", updated: "28/07/2026", status: "Hoạt động" },
    ],
  },
};

const initialNotifications: AdminNotification[] = [
  {
    id: "notification-order",
    title: "Có đơn hàng mới #AH10429",
    description: "Đơn ChatGPT Plus trị giá 450.000đ đang chờ xử lý.",
    time: "2 phút trước",
    section: "orders",
    icon: ShoppingCart,
    tone: "cyan",
    unread: true,
  },
  {
    id: "notification-stock",
    title: "Gemini Pro 5TB sắp hết hàng",
    description: "Kho hiện chỉ còn 8 sản phẩm khả dụng.",
    time: "12 phút trước",
    section: "inventory",
    icon: AlertTriangle,
    tone: "amber",
    unread: true,
  },
  {
    id: "notification-customer",
    title: "Khách hàng mới đăng ký",
    description: "Phạm Thu Trang vừa tạo tài khoản và đặt đơn đầu tiên.",
    time: "22 phút trước",
    section: "customers",
    icon: Users,
    tone: "blue",
    unread: true,
  },
  {
    id: "notification-refund",
    title: "Yêu cầu hoàn tiền đã được duyệt",
    description: "Giao dịch GD-722979 đang được hoàn về số dư khách hàng.",
    time: "1 giờ trước",
    section: "transactions",
    icon: RefreshCw,
    tone: "green",
    unread: false,
  },
  {
    id: "notification-support",
    title: "Phiếu hỗ trợ ưu tiên cao",
    description: "Khách hàng báo chưa nhận được tài khoản sau thanh toán.",
    time: "2 giờ trước",
    section: "support",
    icon: Headphones,
    tone: "danger",
    unread: false,
  },
];

const notificationStorageKey = "aihub-admin-read-notifications-v1";

const statusTone = (status: string) => {
  if (/hoàn tất|thành công|đang bán|ổn định|hoạt động|đã xác minh|hiển thị|đang chạy|đang hiển thị|sẵn sàng|đã cấu hình/i.test(status)) return "success";
  if (/đang xử lý|chờ|sắp hết|mới|đã lên lịch|đang tạo|cần kiểm tra/i.test(status)) return "warning";
  if (/hủy|hết hàng|tạm khóa|hoàn tiền|đã kết thúc|đã đóng|ẩn/i.test(status)) return "danger";
  return "neutral";
};

function StatusBadge({ children }: { children: string }) {
  return <span className={`${styles.status} ${styles[statusTone(children)]}`}>{children}</span>;
}

function AdminSidebar({ active, open, onSelect, onClose, onLogout }: { active: ModuleId; open: boolean; onSelect: (id: ModuleId) => void; onClose: () => void; onLogout: () => void }) {
  return (
    <>
      <button className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`} onClick={onClose} aria-label="Đóng menu" />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <AIHubLogo href="/admin" size="sm" admin />
          <button className={styles.closeMenu} onClick={onClose} aria-label="Đóng menu"><X size={20} /></button>
        </div>
        <nav className={styles.nav} aria-label="Điều hướng quản trị">
          {navGroups.map((group) => (
            <div className={styles.navGroup} key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={active === item.id ? styles.navActive : ""}
                    onClick={() => { onSelect(item.id); onClose(); }}
                    aria-current={active === item.id ? "page" : undefined}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && <em>{item.badge}</em>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <AIHubLogo href="/admin" size="sm" admin className={styles.footerLogo} />
          <button type="button" className={styles.logoutButton} aria-label="Đăng xuất" title="Đăng xuất" onClick={onLogout}><LogOut size={17} /></button>
        </div>
      </aside>
    </>
  );
}

const overviewOrders = moduleDefinitions.orders.rows.slice(0, 5);

function Overview({ onNavigate, notify }: { onNavigate: (id: ModuleId) => void; notify: (message: string) => void }) {
  const [period, setPeriod] = useState("7 ngày");
  const chart = [42, 58, 47, 72, 65, 83, 76, 92, 68, 86, 80, 96];
  const stats = [
    { label: "Doanh thu hôm nay", value: "18.420.000đ", change: "+12,5%", icon: CircleDollarSign, tone: "cyan", positive: true },
    { label: "Đơn hàng mới", value: "148", change: "+8,2%", icon: ShoppingCart, tone: "blue", positive: true },
    { label: "Khách hàng mới", value: "36", change: "+5,1%", icon: Users, tone: "green", positive: true },
    { label: "Tỷ lệ hoàn tiền", value: "1,8%", change: "-0,4%", icon: RefreshCw, tone: "amber", positive: false },
  ];

  return (
    <div className={styles.overview}>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}><ShieldCheck size={15} /> Hệ thống đang hoạt động ổn định</span>
          <h1>Chào buổi sáng, Quản trị viên</h1>
          <p>Đây là tình hình hoạt động của AIHUB hôm nay, 16 tháng 8 năm 2026.</p>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.secondaryButton} onClick={() => notify("Dữ liệu dashboard đã được làm mới.")}><RefreshCw size={17} /> Làm mới</button>
          <button className={styles.primaryButton} onClick={() => onNavigate("products")}><Plus size={17} /> Thêm sản phẩm</button>
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Chỉ số kinh doanh">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className={styles.statCard} key={stat.label}>
              <div className={`${styles.statIcon} ${styles[stat.tone]}`}><Icon size={20} /></div>
              <div className={styles.statMeta}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small className={stat.positive ? styles.up : styles.down}>
                  {stat.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{stat.change}
                  <i> so với hôm qua</i>
                </small>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.dashboardGrid}>
        <article className={`${styles.panel} ${styles.revenuePanel}`}>
          <div className={styles.panelHeader}>
            <div><h2>Doanh thu</h2><p>Tổng doanh thu theo khoảng thời gian</p></div>
            <div className={styles.segmented}>
              {["7 ngày", "30 ngày", "12 tháng"].map((item) => <button key={item} className={period === item ? styles.segmentActive : ""} onClick={() => setPeriod(item)}>{item}</button>)}
            </div>
          </div>
          <div className={styles.revenueSummary}><strong>124.680.000đ</strong><span><ArrowUpRight size={14} /> 16,8%</span></div>
          <div className={styles.chart} aria-label={`Biểu đồ doanh thu ${period}`}>
            <div className={styles.chartLines}><i /><i /><i /><i /></div>
            <div className={styles.bars}>
              {chart.map((value, index) => <span key={index} style={{ height: `${value}%` }}><i>{value}</i></span>)}
            </div>
          </div>
          <div className={styles.chartLabels}><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>
        </article>

        <article className={`${styles.panel} ${styles.quickPanel}`}>
          <div className={styles.panelHeader}><div><h2>Thao tác nhanh</h2><p>Công việc thường dùng</p></div></div>
          <div className={styles.quickGrid}>
            {[
              { label: "Thêm sản phẩm", detail: "Tạo mặt hàng mới", icon: Plus, id: "products" as ModuleId },
              { label: "Duyệt đơn hàng", detail: "18 đơn đang chờ", icon: CheckCircle2, id: "orders" as ModuleId },
              { label: "Kiểm tra kho", detail: "5 cảnh báo mới", icon: Warehouse, id: "inventory" as ModuleId },
              { label: "Hỗ trợ khách", detail: "9 phiếu chưa xử lý", icon: Headphones, id: "support" as ModuleId },
            ].map((action) => {
              const Icon = action.icon;
              return <button key={action.label} onClick={() => onNavigate(action.id)}><span><Icon size={18} /></span><div><strong>{action.label}</strong><small>{action.detail}</small></div><ChevronRight size={16} /></button>;
            })}
          </div>
        </article>
      </section>

      <section className={styles.lowerGrid}>
        <article className={`${styles.panel} ${styles.ordersPanel}`}>
          <div className={styles.panelHeader}>
            <div><h2>Đơn hàng gần đây</h2><p>Cập nhật theo thời gian thực</p></div>
            <button className={styles.textButton} onClick={() => onNavigate("orders")}>Xem tất cả <ChevronRight size={15} /></button>
          </div>
          <div className={styles.tableScroll}>
            <table className={styles.dataTable}>
              <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Giá trị</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
              <tbody>{overviewOrders.map((row) => <tr key={row.id}><td data-label="Mã đơn"><strong>{row.id}</strong></td><td data-label="Khách hàng">{row.customer}<small>{row.product}</small></td><td data-label="Giá trị">{row.value}</td><td data-label="Trạng thái"><StatusBadge>{row.status}</StatusBadge></td><td data-label="Thời gian">{row.date}</td></tr>)}</tbody>
            </table>
          </div>
        </article>

        <div className={styles.sideStack}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}><div><h2>Cảnh báo kho</h2><p>Sản phẩm cần bổ sung</p></div><button className={styles.iconButton} onClick={() => onNavigate("inventory")} aria-label="Xem kho"><ChevronRight size={17} /></button></div>
            <div className={styles.alertList}>
              {[
                { name: "Proxy dân cư Việt Nam", stock: "Đã hết hàng", tone: "danger" },
                { name: "Gemini Pro 5TB", stock: "Còn 8 sản phẩm", tone: "warning" },
                { name: "ChatGPT Team", stock: "Còn 12 sản phẩm", tone: "warning" },
              ].map((item) => <button key={item.name} onClick={() => onNavigate("inventory")}><span className={styles[item.tone]}><AlertTriangle size={16} /></span><div><strong>{item.name}</strong><small>{item.stock}</small></div><ChevronRight size={15} /></button>)}
            </div>
          </article>
          <article className={styles.panel}>
            <div className={styles.panelHeader}><div><h2>Hoạt động gần đây</h2><p>Thay đổi trong hệ thống</p></div></div>
            <div className={styles.activityList}>
              <div><span className={styles.cyan}><Package size={15} /></span><p><strong>Admin</strong> cập nhật giá Gemini Pro<small>8 phút trước</small></p></div>
              <div><span className={styles.green}><CheckCircle2 size={15} /></span><p>Đơn <strong>#AH10428</strong> đã hoàn tất<small>10 phút trước</small></p></div>
              <div><span className={styles.blue}><Users size={15} /></span><p>Khách hàng <strong>Phạm Thu Trang</strong> vừa đăng ký<small>22 phút trước</small></p></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function escapeCsvCell(value: string) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function ManagementView({ definition, query, onQueryChange, onCreate, onInspect, onQuickUpdate, notify }: {
  definition: ModuleDefinition;
  query: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
  onInspect: (row: DataRow) => void;
  onQuickUpdate: (row: DataRow) => void;
  notify: (message: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const pageSize = 5;
  const statuses = useMemo(() => ["Tất cả trạng thái", ...Array.from(new Set(definition.rows.map((row) => row.status)))], [definition.rows]);
  const filteredRows = useMemo(() => definition.rows.filter((row) => {
    const matchesQuery = Object.values(row).some((value) => value.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === "Tất cả trạng thái" || row.status === statusFilter;
    return matchesQuery && matchesStatus;
  }), [definition.rows, query, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      if (!statusMenuRef.current?.contains(event.target as Node)) setStatusMenuOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStatusMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  const exportCsv = () => {
    const header = definition.columns.map((column) => escapeCsvCell(column.label)).join(",");
    const body = filteredRows.map((row) => definition.columns.map((column) => escapeCsvCell(row[column.key] ?? "")).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${definition.title.toLowerCase().replaceAll(" ", "-")}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify("Đã xuất dữ liệu CSV thành công.");
  };

  const Icon = definition.icon;
  return (
    <div className={styles.management}>
      <section className={styles.pageTitle}>
        <div className={styles.titleIcon}><Icon size={23} /></div>
        <div><h1>{definition.title}</h1><p>{definition.description}</p></div>
        <div className={styles.pageActions}>
          <button className={styles.secondaryButton} onClick={exportCsv}><Download size={17} /> Xuất dữ liệu</button>
          {definition.createLabel && <button className={styles.primaryButton} onClick={onCreate}><Plus size={17} /> {definition.createLabel}</button>}
        </div>
      </section>

      <section className={styles.summaryStrip}>
        <div><span>Tổng dữ liệu</span><strong>{definition.rows.length}</strong></div>
        <div><span>Đang hoạt động</span><strong>{Math.max(1, definition.rows.length - 1)}</strong></div>
        <div><span>Cần xử lý</span><strong className={styles.warningText}>{Math.min(3, definition.rows.length)}</strong></div>
        <div><span>Cập nhật gần nhất</span><strong>Vừa xong</strong></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.searchBox}><Search size={17} /><input value={query} onChange={(event) => { setPage(1); onQueryChange(event.target.value); }} placeholder={`Tìm trong ${definition.title.toLowerCase()}...`} /></label>
          <div className={styles.toolbarRight}>
            <div ref={statusMenuRef} className={styles.statusSelect}>
              <button
                type="button"
                className={`${styles.statusSelectTrigger} ${statusMenuOpen ? styles.statusSelectTriggerOpen : ""}`}
                onClick={() => setStatusMenuOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={statusMenuOpen}
              >
                <SlidersHorizontal size={16} />
                <span>{statusFilter}</span>
                <ChevronDown size={15} className={statusMenuOpen ? styles.chevronOpen : ""} />
              </button>
              {statusMenuOpen && (
                <div className={styles.statusSelectMenu} role="listbox" aria-label="Lọc theo trạng thái">
                  <div className={styles.statusSelectLabel}>Lọc trạng thái</div>
                  {statuses.map((status) => {
                    const selected = statusFilter === status;
                    return (
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={selected ? styles.statusOptionSelected : ""}
                        key={status}
                        onClick={() => {
                          setPage(1);
                          setStatusFilter(status);
                          setStatusMenuOpen(false);
                        }}
                      >
                        <span className={styles.statusOptionDot} />
                        <span>{status}</span>
                        {selected && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button className={styles.iconButton} onClick={() => { setPage(1); onQueryChange(""); setStatusFilter("Tất cả trạng thái"); }} title="Đặt lại bộ lọc"><RefreshCw size={17} /></button>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={`${styles.dataTable} ${styles.managementTable}`}>
            <thead><tr>{definition.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th><span className="sr-only">Thao tác</span></th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {definition.columns.map((column, index) => (
                    <td key={column.key} data-label={column.label}>
                      {column.key === "status" ? <StatusBadge>{row[column.key]}</StatusBadge> : index === 0 ? <strong>{row[column.key]}</strong> : row[column.key]}
                    </td>
                  ))}
                  <td data-label="Thao tác"><div className={styles.rowActions}><button onClick={() => onInspect(row)} title="Xem chi tiết" aria-label={`Xem chi tiết ${row.id}`}><Eye size={16} /></button><button onClick={() => onQuickUpdate(row)} title="Đánh dấu đã xử lý" aria-label={`Đánh dấu ${row.id} đã xử lý`}><CheckCircle2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredRows.length && <div className={styles.emptyState}><Search size={24} /><strong>Không tìm thấy dữ liệu</strong><span>Thử thay đổi từ khóa hoặc bộ lọc trạng thái.</span></div>}
        </div>
        <div className={styles.pagination}><span>Hiển thị <strong>{rows.length}</strong> / {filteredRows.length} kết quả</span><div><button disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Trước</button><button className={styles.pageActive}>{currentPage} / {pageCount}</button><button disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Tiếp</button></div></div>
      </section>
    </div>
  );
}

type DraftData = {
  name: string;
  category: string;
  status: string;
  value: string;
  quantity: string;
  description: string;
};

function useDialogBehavior(onClose: () => void) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  return dialogRef;
}

function CreateModal({ title, onClose, onSave }: { title: string; onClose: () => void; onSave: (draft: DraftData) => void }) {
  const dialogRef = useDialogBehavior(onClose);

  return (
    <div className={styles.modalLayer} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="create-title">
        <div className={styles.modalHeader}><div><span>TẠO DỮ LIỆU MỚI</span><h2 id="create-title">{title}</h2></div><button onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
        <form onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          onSave({
            name: String(data.get("name") ?? ""),
            category: String(data.get("category") ?? ""),
            status: String(data.get("status") ?? ""),
            value: String(data.get("value") ?? ""),
            quantity: String(data.get("quantity") ?? ""),
            description: String(data.get("description") ?? ""),
          });
        }}>
          <div className={styles.formGrid}>
            <label className={styles.fullField}><span>Tên / tiêu đề</span><input name="name" required placeholder="Nhập tên hiển thị" autoFocus /></label>
            <label><span>Danh mục</span><select name="category" defaultValue="Tài khoản"><option>Tài khoản</option><option>Phần mềm</option><option>Proxy & VPN</option><option>Dịch vụ</option></select></label>
            <label><span>Trạng thái</span><select name="status" defaultValue="Hoạt động"><option>Hoạt động</option><option>Bản nháp</option><option>Tạm ẩn</option></select></label>
            <label><span>Giá / giá trị</span><input name="value" inputMode="numeric" pattern="[0-9]*" placeholder="0" /></label>
            <label><span>Số lượng</span><input name="quantity" inputMode="numeric" pattern="[0-9]*" placeholder="0" /></label>
            <label className={styles.fullField}><span>Mô tả</span><textarea name="description" rows={4} placeholder="Thông tin chi tiết..." /></label>
          </div>
          <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={onClose}>Hủy</button><button type="submit" className={styles.primaryButton}><CheckCircle2 size={17} /> Lưu dữ liệu</button></div>
        </form>
      </section>
    </div>
  );
}

function DetailModal({ definition, row, onClose, onUpdate }: { definition: ModuleDefinition; row: DataRow; onClose: () => void; onUpdate: () => void }) {
  const dialogRef = useDialogBehavior(onClose);
  return (
    <div className={styles.modalLayer} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className={`${styles.modal} ${styles.detailModal}`} role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <div className={styles.modalHeader}><div><span>CHI TIẾT DỮ LIỆU</span><h2 id="detail-title">{row.id}</h2></div><button onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
        <div className={styles.detailGrid}>
          {definition.columns.map((column) => <div key={column.key}><span>{column.label}</span>{column.key === "status" ? <StatusBadge>{row[column.key]}</StatusBadge> : <strong>{row[column.key] || "—"}</strong>}</div>)}
        </div>
        <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={onClose}>Đóng</button><button type="button" className={styles.primaryButton} onClick={onUpdate}><CheckCircle2 size={17} /> Đánh dấu đã xử lý</button></div>
      </section>
    </div>
  );
}

function createClientRow(definition: ModuleDefinition, draft: DraftData): DataRow {
  const id = `NEW-${Date.now().toString().slice(-6)}`;
  const row: DataRow = { id };
  for (const column of definition.columns) {
    if (column.key === "id") continue;
    if (["name", "title", "product", "customer", "subject", "account"].includes(column.key)) row[column.key] = draft.name;
    else if (column.key === "category" || column.key === "channel" || column.key === "type") row[column.key] = draft.category;
    else if (column.key === "status") row[column.key] = draft.status;
    else if (["price", "value", "revenue", "spend"].includes(column.key)) row[column.key] = draft.value ? `${Number(draft.value).toLocaleString("vi-VN")}đ` : "0đ";
    else if (["stock", "available", "products", "orders", "uses"].includes(column.key)) row[column.key] = draft.quantity || "0";
    else if (column.key === "description") row[column.key] = draft.description || "Chưa có mô tả";
    else if (["date", "updated", "created"].includes(column.key)) row[column.key] = "Vừa xong";
    else row[column.key] = "—";
  }
  return row;
}

const completedStatus: Record<Exclude<ModuleId, "overview">, string> = {
  orders: "Hoàn tất", products: "Đang bán", inventory: "Ổn định", customers: "Hoạt động",
  transactions: "Thành công", deposits: "Hoàn tất", categories: "Hiển thị", promotions: "Đang chạy", content: "Đang hiển thị",
  support: "Đã đóng", reports: "Sẵn sàng", settings: "Đã cấu hình",
};

type StoredRows = Partial<Record<Exclude<ModuleId, "overview">, DataRow[]>>;
const storageKey = "aihub-admin-client-rows-v1";

export function AdminDashboard({ initialView = "overview" }: { initialView?: AdminSection }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const active = initialView;
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<DataRow | null>(null);
  const [storedRows, setStoredRows] = useState<StoredRows>({});
  const [storageReady, setStorageReady] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [toast, setToast] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setStoredRows(JSON.parse(saved) as StoredRows);
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const closeNotifications = (event: PointerEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) setNotificationOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationOpen(false);
    };
    document.addEventListener("pointerdown", closeNotifications);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeNotifications);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(notificationStorageKey);
        const readIds = saved ? new Set(JSON.parse(saved) as string[]) : new Set<string>();
        if (readIds.size) setNotifications((current) => current.map((item) => readIds.has(item.id) ? { ...item, unread: false } : item));
      } catch {
        window.localStorage.removeItem(notificationStorageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (storageReady) window.localStorage.setItem(storageKey, JSON.stringify(storedRows));
  }, [storageReady, storedRows]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const profileInitials = (user?.fullName ?? "Quản trị viên")
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  };

  const selectModule = (id: ModuleId) => {
    setQuery("");
    setDetailRow(null);
    setNotificationOpen(false);
    router.push(id === "overview" ? "/admin" : `/admin/${id}`);
  };

  const activeLabel = navGroups.flatMap((group) => group.items).find((item) => item.id === active)?.label ?? "Quản trị";
  const baseDefinition = active === "overview" ? null : moduleDefinitions[active];
  const definition = baseDefinition && active !== "overview" ? { ...baseDefinition, rows: storedRows[active] ?? baseDefinition.rows } : null;
  const unreadNotifications = notifications.filter((notification) => notification.unread).length;

  const saveReadNotifications = (items: AdminNotification[]) => {
    const readIds = items.filter((item) => !item.unread).map((item) => item.id);
    window.localStorage.setItem(notificationStorageKey, JSON.stringify(readIds));
  };

  const openNotification = (notification: AdminNotification) => {
    setNotifications((current) => {
      const next = current.map((item) => item.id === notification.id ? { ...item, unread: false } : item);
      saveReadNotifications(next);
      return next;
    });
    selectModule(notification.section);
  };

  const updateRow = (row: DataRow) => {
    if (!definition || active === "overview") return;
    const nextStatus = completedStatus[active];
    setStoredRows((current) => {
      const source = current[active] ?? moduleDefinitions[active].rows;
      return { ...current, [active]: source.map((item) => item.id === row.id ? { ...item, status: nextStatus } : item) };
    });
    setDetailRow((current) => current?.id === row.id ? { ...current, status: nextStatus } : current);
    notify(`${row.id} đã được cập nhật sang “${nextStatus}”.`);
  };

  const saveRow = (draft: DraftData) => {
    if (!definition || active === "overview") return;
    const newRow = createClientRow(definition, draft);
    setStoredRows((current) => ({ ...current, [active]: [newRow, ...(current[active] ?? moduleDefinitions[active].rows)] }));
    setCreateOpen(false);
    notify("Đã lưu dữ liệu mới trên thiết bị này.");
  };

  return (
    <div className={styles.shell}>
      <AdminSidebar active={active} open={menuOpen} onSelect={selectModule} onClose={() => setMenuOpen(false)} onLogout={handleLogout} />
      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuButton} onClick={() => setMenuOpen(true)} aria-label="Mở menu"><Menu size={21} /></button>
            <div className={styles.breadcrumb}><span>Quản trị</span><ChevronRight size={14} /><strong>{activeLabel}</strong></div>
          </div>
          <div className={styles.topbarActions}>
            <label className={styles.globalSearch}><Search size={17} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm dữ liệu..." aria-label="Tìm kiếm dữ liệu quản trị" /><kbd>Ctrl K</kbd></label>
            <Link href="/" className={styles.storeLink}><ExternalLink size={16} /><span>Xem cửa hàng</span></Link>
            <div ref={notificationRef} className={styles.notificationWrap}>
              <button
                className={`${styles.notificationButton} ${notificationOpen ? styles.notificationButtonOpen : ""}`}
                onClick={() => setNotificationOpen((open) => !open)}
                aria-label={`Thông báo, ${unreadNotifications} chưa đọc`}
                aria-haspopup="dialog"
                aria-expanded={notificationOpen}
              >
                <Bell size={18} />
                {unreadNotifications > 0 && <i>{unreadNotifications > 9 ? "9+" : unreadNotifications}</i>}
              </button>
              {notificationOpen && (
                <section className={styles.notificationPanel} role="dialog" aria-label="Trung tâm thông báo">
                  <div className={styles.notificationHeader}>
                    <div><h2>Thông báo</h2><span>{unreadNotifications ? `${unreadNotifications} thông báo chưa đọc` : "Bạn đã đọc tất cả"}</span></div>
                    {unreadNotifications > 0 && <button onClick={() => setNotifications((current) => {
                      const next = current.map((item) => ({ ...item, unread: false }));
                      saveReadNotifications(next);
                      return next;
                    })}>Đánh dấu đã đọc</button>}
                  </div>
                  <div className={styles.notificationList}>
                    {notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <button
                          key={notification.id}
                          className={notification.unread ? styles.notificationUnread : ""}
                          onClick={() => openNotification(notification)}
                        >
                          <span className={`${styles.notificationIcon} ${styles[notification.tone]}`}><Icon size={16} /></span>
                          <span className={styles.notificationContent}>
                            <strong>{notification.title}</strong>
                            <small>{notification.description}</small>
                            <time>{notification.time}</time>
                          </span>
                          {notification.unread && <span className={styles.unreadDot} aria-label="Chưa đọc" />}
                        </button>
                      );
                    })}
                  </div>
                  <button className={styles.notificationFooter} onClick={() => selectModule("support")}>Xem trung tâm hỗ trợ <ChevronRight size={15} /></button>
                </section>
              )}
            </div>
            <button className={styles.profileButton} onClick={() => selectModule("settings")}><span>{profileInitials}</span><div><strong>{user?.fullName ?? "Quản trị viên"}</strong><small>{user ? roleLabels[user.role] : "Toàn quyền"}</small></div><ChevronDown size={15} /></button>
          </div>
        </header>
        <main className={styles.content}>
          {active === "overview" ? <Overview onNavigate={selectModule} notify={notify} /> : definition && <ManagementView key={active} definition={definition} query={query} onQueryChange={setQuery} onCreate={() => setCreateOpen(true)} onInspect={setDetailRow} onQuickUpdate={updateRow} notify={notify} />}
        </main>
      </div>
      {createOpen && definition && <CreateModal title={definition.createLabel ?? "Thêm dữ liệu"} onClose={() => setCreateOpen(false)} onSave={saveRow} />}
      {detailRow && definition && <DetailModal definition={definition} row={detailRow} onClose={() => setDetailRow(null)} onUpdate={() => updateRow(detailRow)} />}
      <div className={`${styles.toast} ${toast ? styles.toastVisible : ""}`} role="status"><CheckCircle2 size={18} />{toast}</div>
    </div>
  );
}
