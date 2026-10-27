import React, { useState } from 'react';
import { ChevronRight, Mail, MessageSquare, Send, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { Card } from '../design-system/Card';
import { Input } from '../design-system/Input';
import { Button } from '../design-system/Button';
import { Select } from '../design-system/Select';

interface ContactViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('rate-update');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Trigger direct mail client submission
    const subject = encodeURIComponent(`[JibuWise Feedback] ${topic.replace('-', ' ').toUpperCase()} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}\n\nSent from JibuWise Contact Form`);
    const mailtoUrl = `mailto:support@jibuwise.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href="/"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          className="hover:text-[#0b2d21] transition-colors cursor-pointer"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-medium">Contact & Feedback</span>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
          <span>Get in Touch</span>
          <span aria-hidden="true">·</span>
          <span>Community Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b2d21] tracking-tight mb-3">
          Contact the JibuWise Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Noticed a recent statutory change in KRA tax bands, Safaricom M-Pesa tariffs, or EPRA pump rates? Want to suggest a new practical calculator for Kenya or the region? We welcome your input.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <Card padding="lg" variant="default">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-lime-100 text-lime-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0b2d21]">Message Prepared & Dispatched</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your feedback regarding <em>{topic.replace('-', ' ')}</em> has been prepared for dispatch to <code>support@jibuwise.com</code>.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Because JibuWise operates 100% in-browser with zero tracking cookies or database storage, messages are delivered via your standard email client. If your client did not launch automatically, feel free to email us directly at <strong className="text-slate-800">support@jibuwise.com</strong>.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Send Feedback or Report Rate Change
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="contact-name"
                    label="Your Name"
                    type="text"
                    required
                    placeholder="e.g. Wanjiku Kamau"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    id="contact-email"
                    label="Email Address"
                    type="email"
                    required
                    placeholder="wanjiku@example.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Select
                  id="contact-topic"
                  label="Subject / Feedback Type"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  options={[
                    { value: 'rate-update', label: 'Report a Rate or Tariff Change (KRA, Safaricom, EPRA)' },
                    { value: 'tool-suggestion', label: 'Suggest a New Calculator / Practical Tool' },
                    { value: 'calculation-inquiry', label: 'Question About a Specific Calculation Formula' },
                    { value: 'general-feedback', label: 'General Feedback or Website Suggestion' },
                  ]}
                />

                <div className="w-full">
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 tracking-tight mb-1.5">
                    Your Message / Rate Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please include details, reference links to official notices (e.g. KRA gazette notice, Safaricom tariff revision), or the calculator you are referencing..."
                    className="w-full p-3.5 text-sm text-slate-900 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0b2d21] focus:ring-2 focus:ring-lime-500/30 placeholder:text-slate-400"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Send className="w-4 h-4 text-lime-400" />}
                >
                  Submit Feedback
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Right Column: Contact info & Expectations */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="md" variant="muted">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Review & Verification</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              JibuWise relies on published primary sources: the Kenya Gazette, Kenya Revenue Authority (KRA) circulars, Safaricom Kenya rate sheets, and Energy and Petroleum Regulatory Authority (EPRA) determinations.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              When reporting a discrepancy, providing the gazette notice number or effective date helps our technical team verify and deploy formula updates swiftly.
            </p>
          </Card>

          <Card padding="md" variant="default">
            <h3 className="text-sm font-bold text-[#0b2d21] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-lime-700" />
              <span>Editorial Inquiries</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              For academic, research, or developer inquiries regarding our open-architecture tools:
            </p>
            <div className="text-xs font-mono-numbers text-slate-800 font-semibold p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              support@jibuwise.com
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
              <span>Nairobi, Kenya</span>
              <span aria-hidden="true">·</span>
              <span>Online Community Project</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
