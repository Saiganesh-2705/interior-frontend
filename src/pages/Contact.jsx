import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api, { errMsg } from '../api';

const blank = { name: '', email: '', phone: '', projectType: '', budget: '', message: '' };

export default function Contact() {
  const prefill = useLocation().state || {};
  const [f, setF] = useState({ ...blank, message: prefill.message || '', projectType: prefill.projectType || '' });
  const [state, setState] = useState({ busy: false, ok: '', err: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: '', err: '' });
    try {
      const { data } = await api.post('/enquiries', f);
      setState({ busy: false, ok: data.message, err: '' });
      setF(blank);
    } catch (err) {
      setState({ busy: false, ok: '', err: errMsg(err) });
    }
  };

  return (
    <div className="page-pad">
      <div className="wrap split contact">
        <div>
          <h1>Book a free consultation</h1>
          <p className="lead-text">Tell us about your space. We will call you within one working day to arrange a site visit.</p>
          <ul className="contact-list">
            <li><strong>Studio</strong>12 Gandhi Road, Chennai, Tamil Nadu</li>
            <li><strong>Hours</strong>Mon-Sat, 10:00 AM - 7:00 PM</li>
            <li><strong>Phone</strong><a href="tel:+919876543210">+91 98765 43210</a></li>
            <li><strong>Email</strong><a href="mailto:hello@luxeinteriors.com">hello@luxeinteriors.com</a></li>
          </ul>
          <p className="note">Prefer a quick answer? Use the chat in the corner.</p>
        </div>

        <form className="form" onSubmit={submit}>
          <label>Full name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
          <label>Phone number<input required type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></label>
          <label>Email (optional)<input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
          <div className="two">
            <label>Project type
              <select value={f.projectType} onChange={set('projectType')}>
                <option value="">Choose one</option>
                <option>Living room</option><option>Bedroom</option><option>Modular kitchen</option><option>Full home</option><option>Office or retail</option>
              </select>
            </label>
            <label>Budget range
              <select value={f.budget} onChange={set('budget')}>
                <option value="">Choose one</option>
                <option>Under Rs 3 lakh</option><option>Rs 3 - 8 lakh</option><option>Rs 8 - 20 lakh</option><option>Above Rs 20 lakh</option>
              </select>
            </label>
          </div>
          <label>About your project<textarea rows="4" value={f.message} onChange={set('message')} /></label>
          {state.err && <p className="error" role="alert">{state.err}</p>}
          {state.ok && <p className="success" role="status">{state.ok}</p>}
          <button className="btn" disabled={state.busy}>{state.busy ? 'Sending...' : 'Send enquiry'}</button>
        </form>
      </div>
    </div>
  );
}
