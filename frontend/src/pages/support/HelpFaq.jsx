import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SupportNav } from '../../components/support/SupportNav';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../../data/faqData';
import { CONTACT_CONFIG } from '../../config/contactConfig';
import {
  Search,
  ChevronDown,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  AlertTriangle,
  X,
  Compass,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HelpFaq = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set(['book-1', 'safe-1']));

  // Filtered FAQ questions based on search query and category
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-background flex flex-col transition-colors">
      <SupportNav />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Intro & Search Bar */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary dark:bg-primary/20 dark:text-emerald-300 text-xs font-bold border border-primary/20">
            <HelpCircle size={13} className="text-primary" />
            <span>Knowledge Base & Common Questions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight">
            Help Center & FAQ
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Find immediate answers to questions regarding booking seats, route scheduling, cancellations, payments, and safety protocols.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl mx-auto mt-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, topic, or question (e.g. cancellation, seats, payment)..."
              className="w-full min-h-[48px] pl-10 pr-10 text-sm bg-surface dark:bg-[#18241F] border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-xs transition-colors"
              aria-label="Search FAQ questions"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary"
                aria-label="Clear search input"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div
          role="tablist"
          aria-label="FAQ Categories"
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1"
        >
          {FAQ_CATEGORIES.map(({ id, label }) => {
            const isSelected = selectedCategory === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`
                  px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface dark:bg-[#18241F] text-text-secondary border border-border hover:border-primary/50 hover:text-text-primary'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <section aria-labelledby="faq-list-heading" className="space-y-3">
          <h2 id="faq-list-heading" className="sr-only">
            Frequently Asked Questions List
          </h2>

          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedIds.has(faq.id);
                return (
                  <div
                    key={faq.id}
                    className="bg-surface dark:bg-[#18241F] border border-border rounded-xl overflow-hidden transition-colors shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-4 hover:bg-border-subtle/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span className="text-sm sm:text-base font-bold text-text-primary font-heading leading-snug">
                        {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full bg-border-subtle dark:bg-white/5 flex items-center justify-center shrink-0 text-text-secondary transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      >
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-answer-${faq.id}`}
                        className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-subtle"
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-surface dark:bg-[#18241F] border border-border rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center mx-auto">
                <Search size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  No matching answers found
                </h3>
                <p className="text-xs text-text-secondary max-w-md mx-auto">
                  We couldn't find an answer matching "{searchQuery}". Try different search terms or contact our support team directly.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Button variant="outline" size="sm" onClick={clearSearch}>
                  Reset Search
                </Button>
                <Link to="/contact">
                  <Button variant="primary" size="sm">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Still Need Help? Banner ──────────────────────── */}
        <section
          aria-labelledby="still-need-help-title"
          className="bg-[#1C2E25] text-white border border-[#2D4538] rounded-2xl p-6 sm:p-8 lg:p-10 space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 id="still-need-help-title" className="text-xl sm:text-2xl font-bold font-heading text-white">
                Still have questions or need assistance?
              </h2>
              <p className="text-xs sm:text-sm text-[#C2D4CB] leading-relaxed max-w-xl">
                Our support team is available 24/7 across Phone, WhatsApp, and Email to assist commuters and driver partners.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-xs font-bold border border-emerald-500/30 shrink-0">
              <span>{CONTACT_CONFIG.availability.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* Contact Form Link */}
            <Link
              to="/contact"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary transition-all text-xs font-semibold"
            >
              <Mail size={16} className="text-primary shrink-0" />
              <span>Contact Form</span>
            </Link>

            {/* Direct Phone */}
            <a
              href={CONTACT_CONFIG.phone.link}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary transition-all text-xs font-semibold"
            >
              <Phone size={16} className="text-primary shrink-0" />
              <span>Call {CONTACT_CONFIG.phone.display}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={CONTACT_CONFIG.whatsapp.getLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary transition-all text-xs font-semibold"
            >
              <MessageCircle size={16} className="text-emerald-400 shrink-0" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Report a Problem Link */}
            <Link
              to="/report-problem"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400 transition-all text-xs font-semibold text-amber-300"
            >
              <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              <span>Report an Issue</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpFaq;
