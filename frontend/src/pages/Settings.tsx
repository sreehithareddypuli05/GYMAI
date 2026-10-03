import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink, Info, LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

export default function Settings() {
  const { logout, user } = useAuth()

  return (
    <AppShell>
      <PageHeader eyebrow="Account" title="Settings" description="Manage your GymAI account, security and support preferences." />

      <div className="github-settings">
        <aside className="github-settings-nav" aria-label="Settings sections">
          <p className="github-settings-nav-title">Settings</p>
          <a href="#account" className="github-settings-nav-item active"><UserRound size={15} /> Account</a>
          <a href="#security" className="github-settings-nav-item"><ShieldCheck size={15} /> Security</a>
          <a href="#about" className="github-settings-nav-item"><Info size={15} /> About GymAI</a>
          <a href="#contact" className="github-settings-nav-item"><Mail size={15} /> Contact</a>
        </aside>

        <div className="github-settings-content">
          <section id="account" className="github-settings-section">
            <div className="github-section-heading">
              <div>
                <h2>Account</h2>
                <p>Your basic GymAI account information.</p>
              </div>
            </div>
            <div className="github-row">
              <div className="github-row-icon"><UserRound size={18} /></div>
              <div className="github-row-copy"><strong>{user?.full_name || 'GymAI member'}</strong><span>{user?.email || 'No email available'}</span></div>
              <Link to="/profile" className="github-row-button">View profile <ChevronRight size={15} /></Link>
            </div>
          </section>

          <section id="security" className="github-settings-section">
            <div className="github-section-heading">
              <div>
                <h2>Password and security</h2>
                <p>Keep your account protected with a verified password reset.</p>
              </div>
            </div>
            <div className="github-row">
              <div className="github-row-icon"><ShieldCheck size={18} /></div>
              <div className="github-row-copy"><strong>Forgot password</strong><span>Verify your email with a one-time code, then choose a new password.</span></div>
              <Link to="/forgot-password" className="github-row-button">Reset password <ChevronRight size={15} /></Link>
            </div>
          </section>

          <section id="about" className="github-settings-section">
            <div className="github-section-heading">
              <div>
                <h2>About GymAI</h2>
                <p>Learn what your fitness dashboard is built to help you do.</p>
              </div>
            </div>
            <div className="github-about-box">
              <div className="github-row-icon"><Info size={18} /></div>
              <div className="github-row-copy"><strong>GymAI — Intelligent Fitness System</strong><span>Personalized workouts, exercise guidance, progress tracking and consistency tools in one place.</span></div>
            </div>
          </section>

          <section id="contact" className="github-settings-section">
            <div className="github-section-heading">
              <div>
                <h2>Contact us</h2>
                <p>Need help with your GymAI account or training experience?</p>
              </div>
            </div>
            <a href="mailto:support@gymai.app" className="github-row github-link-row">
              <div className="github-row-icon"><Mail size={18} /></div>
              <div className="github-row-copy"><strong>GymAI support</strong><span>support@gymai.app</span></div>
              <ExternalLink size={15} className="github-row-arrow" />
            </a>
          </section>

          <section className="github-settings-section github-danger-section">
            <div className="github-section-heading">
              <div>
                <h2>Session</h2>
                <p>Sign out of GymAI on this device. Your account data stays intact.</p>
              </div>
            </div>
            <div className="github-row github-danger-row">
              <div className="github-row-icon"><LogOut size={18} /></div>
              <div className="github-row-copy"><strong>Log out</strong><span>End your current GymAI session.</span></div>
              <Button variant="danger" size="sm" onClick={() => logout()}><LogOut size={14} /> Log out</Button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
