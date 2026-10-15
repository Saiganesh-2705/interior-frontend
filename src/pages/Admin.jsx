import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import api, { errMsg } from '../api';

const TABS = ['Overview', 'Enquiries', 'Projects', 'Testimonials'];
const CATS = ['Living room', 'Bedroom', 'Kitchen', 'Office', 'Full home'];
const STATUSES = ['new', 'contacted', 'booked', 'closed'];
const date = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function Overview() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/stats').then((r) => setS(r.data)); }, []);
  if (!s) return <p>Loading...</p>;
  const cards = [['Enquiries', s.enquiries], ['New, not yet called', s.newEnquiries], ['From the chatbot', s.fromChatbot], ['Projects', s.projects], ['Services', s.services], ['Testimonials', s.testimonials]];
  return <div className="stat-grid">{cards.map(([l, n]) => <div key={l} className="stat"><strong>{n}</strong><span>{l}</span></div>)}</div>;
}

function Enquiries() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');
  const [err, setErr] = useState('');
  useEffect(() => { api.get('/enquiries').then((r) => setRows(r.data)).catch((e) => setErr(errMsg(e))); }, []);

  const setStatus = async (id, status) => {
    const { data } = await api.patch(`/enquiries/${id}`, { status });
    setRows(rows.map((r) => (r._id === id ? data : r)));
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry? This cannot be undone.')) return;
    await api.delete(`/enquiries/${id}`);
    setRows(rows.filter((r) => r._id !== id));
  };
  const shown = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  return (
    <>
      <div className="chips">
        {['all', ...STATUSES].map((s) => <button key={s} className={s === filter ? 'chip on' : 'chip'} onClick={() => setFilter(s)}>{s}</button>)}
      </div>
      {err && <p className="error">{err}</p>}
      {!shown.length && <p>No enquiries here yet. New ones from the contact form and chatbot appear in this list.</p>}
      <div className="table-wrap">
        {shown.length > 0 && (
          <table>
            <thead><tr><th>Received</th><th>Name</th><th>Contact</th><th>Project</th><th>Source</th><th>Status</th><th /></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r._id}>
                  <td>{date(r.createdAt)}</td>
                  <td>{r.name}</td>
                  <td><a href={`tel:${r.phone}`}>{r.phone}</a>{r.email && <><br />{r.email}</>}</td>
                  <td>{r.projectType || '-'}{r.budget && <><br /><small>{r.budget}</small></>}{r.message && <><br /><small>{r.message}</small></>}</td>
                  <td>{r.source}</td>
                  <td>
                    <select value={r.status} onChange={(e) => setStatus(r._id, e.target.value)} aria-label={`Status for ${r.name}`}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button className="link-btn danger" onClick={() => remove(r._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const blankProject = { title: '', category: 'Living room', style: '', location: '', areaSqft: '', year: new Date().getFullYear(), cover: '', gallery: '', summary: '', description: '', featured: false };

function Projects() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState(blankProject);
  const [msg, setMsg] = useState({ ok: '', err: '' });
  const load = () => api.get('/projects').then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const add = async (e) => {
    e.preventDefault();
    setMsg({ ok: '', err: '' });
    try {
      await api.post('/projects', {
        ...f,
        areaSqft: Number(f.areaSqft) || 0,
        year: Number(f.year) || new Date().getFullYear(),
        gallery: f.gallery.split(/[\n,]/).map((x) => x.trim()).filter(Boolean)
      });
      setF(blankProject);
      setMsg({ ok: 'Project added.', err: '' });
      load();
    } catch (x) { setMsg({ ok: '', err: errMsg(x) }); }
  };
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    await api.delete(`/projects/${p._id}`);
    setRows(rows.filter((r) => r._id !== p._id));
  };
  const toggle = async (p) => {
    const { data } = await api.put(`/projects/${p._id}`, { featured: !p.featured });
    setRows(rows.map((r) => (r._id === p._id ? data : r)));
  };

  return (
    <div className="admin-split">
      <form className="form" onSubmit={add}>
        <h3>Add a project</h3>
        <label>Title<input required value={f.title} onChange={set('title')} /></label>
        <div className="two">
          <label>Category<select value={f.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Style<input value={f.style} onChange={set('style')} placeholder="Warm minimal" /></label>
        </div>
        <div className="two">
          <label>Location<input value={f.location} onChange={set('location')} /></label>
          <label>Area (sq ft)<input type="number" min="0" value={f.areaSqft} onChange={set('areaSqft')} /></label>
        </div>
        <label>Year<input type="number" value={f.year} onChange={set('year')} /></label>
        <label>Cover image URL<input type="url" value={f.cover} onChange={set('cover')} placeholder="https://..." /></label>
        <label>Gallery image URLs (one per line)<textarea rows="3" value={f.gallery} onChange={set('gallery')} /></label>
        <label>One-line summary<input value={f.summary} onChange={set('summary')} /></label>
        <label>Description<textarea rows="4" value={f.description} onChange={set('description')} /></label>
        <label className="check"><input type="checkbox" checked={f.featured} onChange={set('featured')} /> Show on the home page</label>
        {msg.err && <p className="error" role="alert">{msg.err}</p>}
        {msg.ok && <p className="success" role="status">{msg.ok}</p>}
        <button className="btn">Add project</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Project</th><th>Category</th><th>Home page</th><th /></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id}>
                <td>{p.title}<br /><small>{p.location}, {p.year}</small></td>
                <td>{p.category}</td>
                <td><button className="link-btn" onClick={() => toggle(p)}>{p.featured ? 'Featured (remove)' : 'Feature'}</button></td>
                <td><button className="link-btn danger" onClick={() => remove(p)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Testimonials() {
  const [rows, setRows] = useState([]);
  const [f, setF] = useState({ name: '', place: '', quote: '', rating: 5 });
  const [err, setErr] = useState('');
  const load = () => api.get('/testimonials').then((r) => setRows(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/testimonials', { ...f, rating: Number(f.rating) }); setF({ name: '', place: '', quote: '', rating: 5 }); load(); }
    catch (x) { setErr(errMsg(x)); }
  };
  const remove = async (t) => {
    if (!window.confirm(`Delete the review from ${t.name}?`)) return;
    await api.delete(`/testimonials/${t._id}`);
    setRows(rows.filter((r) => r._id !== t._id));
  };

  return (
    <div className="admin-split">
      <form className="form" onSubmit={add}>
        <h3>Add a testimonial</h3>
        <label>Client name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>Project or place<input value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} /></label>
        <label>Quote<textarea required rows="4" value={f.quote} onChange={(e) => setF({ ...f, quote: e.target.value })} /></label>
        <label>Rating<select value={f.rating} onChange={(e) => setF({ ...f, rating: e.target.value })}>{[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}</select></label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn">Add testimonial</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Client</th><th>Quote</th><th /></tr></thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t._id}><td>{t.name}<br /><small>{t.place}</small></td><td>{t.quote}</td><td><button className="link-btn danger" onClick={() => remove(t)}>Delete</button></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, ready } = useAuth();
  const [tab, setTab] = useState('Overview');
  if (!ready) return <div className="wrap page-pad"><p>Loading...</p></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="page-pad">
      <div className="wrap">
        <h1>Studio admin</h1>
        <div className="tabs" role="tablist">
          {TABS.map((t) => <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? 'tab on' : 'tab'} onClick={() => setTab(t)}>{t}</button>)}
        </div>
        {tab === 'Overview' && <Overview />}
        {tab === 'Enquiries' && <Enquiries />}
        {tab === 'Projects' && <Projects />}
        {tab === 'Testimonials' && <Testimonials />}
      </div>
    </div>
  );
}
