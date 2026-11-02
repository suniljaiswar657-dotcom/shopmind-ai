"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Boxes, BrainCircuit,
  ChartNoAxesCombined, ChevronDown, CircleHelp, Command, Download,
  LayoutDashboard, Menu, PackagePlus, Search, Settings, ShoppingBag,
  ShoppingCart, Sparkles, Users, Wallet, X, Plus, TrendingUp, AlertTriangle
} from "lucide-react";

type Product = { id: number; name: string; sku: string; category: string; stock: number; price: number; status: "Healthy" | "Low stock" | "Out of stock" };

const starterProducts: Product[] = [
  { id: 1, name: "Wireless Headphones", sku: "AUD-001", category: "Electronics", stock: 42, price: 2499, status: "Healthy" },
  { id: 2, name: "Ceramic Coffee Mug", sku: "HOM-014", category: "Home", stock: 8, price: 399, status: "Low stock" },
  { id: 3, name: "Everyday Backpack", sku: "BAG-008", category: "Accessories", stock: 24, price: 1299, status: "Healthy" },
  { id: 4, name: "Smart LED Bulb", sku: "ELC-022", category: "Electronics", stock: 0, price: 599, status: "Out of stock" },
  { id: 5, name: "Steel Water Bottle", sku: "HOM-031", category: "Home", stock: 16, price: 699, status: "Healthy" }
];

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Inventory", icon: Boxes },
  { label: "Sales", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "AI Insights", icon: BrainCircuit }
];

const money = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [products, setProducts] = useState<Product[]>(starterProducts);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [productName, setProductName] = useState("");
  const [productStock, setProductStock] = useState("10");
  const [productPrice, setProductPrice] = useState("499");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("Demo workspace · Changes stay in this browser session");

  const filtered = useMemo(() => products.filter(p => (p.name + p.sku + p.category).toLowerCase().includes(query.toLowerCase())), [products, query]);
  const lowCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outCount = products.filter(p => p.stock === 0).length;

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!productName.trim()) return;
    const stock = Math.max(0, Number(productStock) || 0);
    const price = Math.max(0, Number(productPrice) || 0);
    const item: Product = {
      id: Date.now(), name: productName.trim(), sku: "NEW-" + String(products.length + 1).padStart(3, "0"),
      category: "General", stock, price,
      status: stock === 0 ? "Out of stock" : stock <= 10 ? "Low stock" : "Healthy"
    };
    setProducts(current => [item, ...current]);
    setProductName(""); setProductStock("10"); setProductPrice("499"); setShowAdd(false);
    setNotice(item.name + " added to your inventory.");
  }

  function exportInventory() {
    const rows = [["Product", "SKU", "Category", "Stock", "Price", "Status"], ...products.map(p => [p.name, p.sku, p.category, String(p.stock), String(p.price), p.status])];
    const csv = rows.map(row => row.map(v => '"' + v.replaceAll('"', '""') + '"').join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "shopmind-inventory.csv"; a.click(); URL.revokeObjectURL(url);
    setNotice("Inventory CSV exported.");
  }

  return (
    <main className="shell">
      <aside className={"sidebar " + (mobileNav ? "sidebar-open" : "")}>
        <div className="brand"><div className="brand-mark"><Command size={20}/></div><div><strong>SHOPMIND<span>AI</span></strong><small>BUSINESS INTELLIGENCE</small></div><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
        <div className="workspace"><div className="workspace-avatar">S</div><div><b>My Store</b><small>Free workspace</small></div><ChevronDown size={15}/></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav>{nav.map(item => <button key={item.label} onClick={() => { setActive(item.label); setMobileNav(false); }} className={"nav-item " + (active === item.label ? "active" : "")}><item.icon size={18}/><span>{item.label}</span>{item.label === "AI Insights" && <span className="new-tag">NEW</span>}</button>)}</nav>
        <div className="nav-caption tools-caption">MANAGE</div>
        <button className="nav-item" onClick={() => setNotice("Reports module is coming in a future release.")}><ChartNoAxesCombined size={18}/><span>Reports</span></button>
        <button className="nav-item" onClick={() => setNotice("Settings module is coming in a future release.")}><Settings size={18}/><span>Settings</span></button>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><b>Need a hand?</b><p>Explore your business workspace and discover what's possible.</p><button onClick={() => setNotice("Help centre will be available in a future release.")}>Visit help centre <ArrowUpRight size={13}/></button></div><div className="profile"><div className="profile-avatar">S</div><div><b>Store Owner</b><small>Administrator</small></div><ChevronDown size={15}/></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="top-left"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div></div><div className="top-actions"><div className="search-global"><Search size={15}/><input placeholder="Search anything..." value={query} onChange={e => setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-button notification" onClick={() => setNotice(lowCount + outCount + " inventory alerts need attention.")}><Bell size={18}/><i/></button><div className="top-avatar">S</div></div></header>

        <div className="content">
          <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot"/> YOUR BUSINESS, IN FOCUS</div><h1>{active === "Overview" ? "Good afternoon." : active + "."} <span>✳</span></h1><p>Here's what's happening with your business today.</p></div><div className="date-chip"><Activity size={15}/> LIVE WORKSPACE <span>·</span> DEMO DATA</div></div>

          <section className="ai-banner"><div className="ai-orb"><Sparkles size={22}/></div><div className="ai-copy"><div className="ai-label">SHOPMIND INTELLIGENCE <span>PREVIEW</span></div><h2>Your business has <em>{lowCount + outCount} inventory alert{lowCount + outCount === 1 ? "" : "s"}</em> to review.</h2><p>{outCount > 0 ? outCount + " product is out of stock." : "Your inventory is looking healthy."} {lowCount > 0 ? lowCount + " product needs restocking." : " No low-stock items right now."}</p></div><button className="ai-action" onClick={() => setActive("AI Insights")}>View AI insights <ArrowUpRight size={15}/></button><div className="banner-glow"/></section>

          <div className="section-heading"><div><h3>Business overview</h3><p>Your store performance at a glance</p></div><button className="date-filter" onClick={() => setNotice("Showing sample overview data for this demo.")}>This month <ChevronDown size={14}/></button></div>
          <div className="metric-grid">
            <Metric icon={<Wallet size={18}/>} label="Total revenue" value="₹1,84,250" change="+12.8%" positive detail="vs. last month"/>
            <Metric icon={<ShoppingBag size={18}/>} label="Total orders" value="1,248" change="+8.2%" positive detail="vs. last month"/>
            <Metric icon={<TrendingUp size={18}/>} label="Net profit" value="₹62,480" change="+6.4%" positive detail="vs. last month"/>
            <Metric icon={<Users size={18}/>} label="Customers" value="864" change="+4.6%" positive detail="vs. last month"/>
          </div>

          <div className="dashboard-grid">
            <section className="panel revenue-panel"><div className="panel-head"><div><h3>Revenue overview</h3><p>Sales performance over the last 7 days</p></div><button className="subtle-select" onClick={() => setNotice("Weekly sample revenue data selected.")}>Last 7 days <ChevronDown size={13}/></button></div><div className="chart-summary"><strong>₹48,290</strong><span className="positive"><ArrowUpRight size={14}/> 14.6%</span><small>vs previous 7 days</small></div><div className="chart"><div className="y-labels"><span>15k</span><span>10k</span><span>5k</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i/><i/><i/><i/></div><svg viewBox="0 0 620 180" preserveAspectRatio="none" role="img" aria-label="Illustrative weekly revenue chart"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#9a82ff" stopOpacity=".25"/><stop offset="100%" stopColor="#9a82ff" stopOpacity="0"/></linearGradient></defs><path d="M0 138 C35 132 48 105 88 113 S145 140 178 99 S228 80 265 92 S320 116 355 70 S415 88 443 53 S495 73 530 35 S580 49 620 16 L620 180 L0 180Z" fill="url(#fill)"/><path d="M0 138 C35 132 48 105 88 113 S145 140 178 99 S228 80 265 92 S320 116 355 70 S415 88 443 53 S495 73 530 35 S580 49 620 16" fill="none" stroke="#9a82ff" strokeWidth="3" strokeLinecap="round"/></svg><div className="x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div></section>
            <section className="panel insight-panel"><div className="panel-head"><div><h3>Smart insights</h3><p>Signals from your business</p></div><div className="spark-small"><Sparkles size={16}/></div></div><div className="insight-item"><div className="insight-icon purple"><TrendingUp size={17}/></div><div><b>Revenue momentum</b><p>Your sample revenue is trending upward this week.</p><small>PERFORMANCE</small></div></div><div className="insight-item"><div className="insight-icon amber"><AlertTriangle size={17}/></div><div><b>Inventory needs attention</b><p>{lowCount + outCount} item(s) currently need a stock review.</p><small>INVENTORY</small></div></div><button className="all-insights" onClick={() => setActive("AI Insights")}>Explore all insights <ArrowUpRight size={14}/></button></section>
          </div>

          <section className="panel inventory-panel"><div className="panel-head inventory-head"><div><h3>Inventory snapshot</h3><p>Keep track of your products and stock levels</p></div><div className="inventory-actions"><button className="outline-button" onClick={exportInventory}><Download size={14}/> Export</button><button className="primary-button" onClick={() => setShowAdd(true)}><Plus size={15}/> Add product</button></div></div><div className="inventory-stats"><span><i className="dot green"/> {products.length} products</span><span><i className="dot amber"/> {lowCount} low stock</span><span><i className="dot red"/> {outCount} out of stock</span></div><div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>STOCK LEVEL</th><th>UNIT PRICE</th><th>STATUS</th></tr></thead><tbody>{filtered.map(p => <tr key={p.id}><td><div className="product-cell"><div className="product-icon"><PackagePlus size={16}/></div><b>{p.name}</b></div></td><td className="muted-cell">{p.sku}</td><td className="muted-cell">{p.category}</td><td><div className="stock-cell"><b>{p.stock}</b><div className="stock-track"><i style={{width: Math.min(100, p.stock / 50 * 100) + "%"}} className={p.stock <= 10 ? "stock-low" : ""}/></div></div></td><td>{money(p.price)}</td><td><span className={"status " + (p.status === "Healthy" ? "status-good" : p.status === "Low stock" ? "status-low" : "status-out")}>{p.status}</span></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No products match your search.</div>}</div><div className="table-footer">Showing {filtered.length} of {products.length} products <span>Demo inventory · Not connected to a live store</span></div></section>
          <footer><span>© 2026 SHOPMIND AI</span><span>BUILT FOR BETTER BUSINESS <Sparkles size={12}/></span></footer>
          {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")}><X size={14}/></button></div>}
        </div>
      </section>

      {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><form className="modal" onSubmit={addProduct} onClick={e => e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">INVENTORY MANAGEMENT</span><h2>Add a product</h2></div><button type="button" className="icon-button" onClick={() => setShowAdd(false)}><X size={18}/></button></div><label>Product name<input required autoFocus value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Cotton T-shirt"/></label><div className="form-row"><label>Opening stock<input type="number" min="0" value={productStock} onChange={e => setProductStock(e.target.value)}/></label><label>Unit price (₹)<input type="number" min="0" value={productPrice} onChange={e => setProductPrice(e.target.value)}/></label></div><p className="modal-note">This adds a demo product to the current browser session. No database is connected yet.</p><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowAdd(false)}>Cancel</button><button type="submit" className="primary-button"><Plus size={15}/> Add product</button></div></form></div>}
    </main>
  );
}

function Metric({ icon, label, value, change, positive, detail }: { icon: React.ReactNode; label: string; value: string; change: string; positive: boolean; detail: string }) {
  return <div className="metric-card"><div className="metric-top"><div className="metric-icon">{icon}</div><span className="metric-change"><ArrowUpRight size={13}/> {change}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-detail">{detail}</div></div>;
}