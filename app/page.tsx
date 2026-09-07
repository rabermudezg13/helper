'use client';

import { useState } from 'react';
import { Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, ClipboardCheck, ExternalLink, KeyRound, Mail, Menu, Pencil, Search, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const steps = [
  { label: 'Before you begin', icon: UserCheck },
  { label: 'First email', icon: Mail },
  { label: 'Initial paperwork', icon: ClipboardCheck },
  { label: 'Access email', icon: KeyRound },
  { label: 'Sign in to the portal', icon: ShieldCheck },
  { label: 'My Stuff', icon: Pencil },
];

const emailTerms = ['First Steps with Kelly', 'Your paperwork is waiting'];

export default function Home() {
  const [step, setStep] = useState(0);
  const [questionsDone, setQuestionsDone] = useState(false);
  const [recruiterKnown, setRecruiterKnown] = useState(false);
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  const go = (next: number) => { setStep(Math.max(0, Math.min(next, steps.length - 1))); setAnswer(null); };
  const canContinue = step !== 0 || (questionsDone && recruiterKnown);
  const helper = answer === 'no'
    ? "Don't worry. Let a representative know, then try again when the email arrives."
    : step === 0 ? "First, let's make sure you have everything ready."
    : step < 4 ? 'Remember to check your Spam or Junk folder too.'
    : "Follow each step in order. I'll stay right here with you.";

  return <main className="min-h-screen bg-background text-foreground">
    <header className="topbar">
      <div className="brand-mark">✎</div><div className="brand-copy"><strong>Sub Helper</strong><span>Your onboarding, step by step</span></div>
      <div className="topbar-actions"><span className="autosave"><Check size={14}/> Progress saved</span><Button variant="outline" className="help-button"><CircleHelp/> Help</Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open menu"><Menu/></Button></div>
    </header>

    <div className="app-shell">
      <aside className="step-sidebar">
        <div className="sidebar-heading"><span>First steps with Kelly</span><strong>Step {step + 1} of {steps.length}</strong></div>
        <nav aria-label="Onboarding progress">{steps.map((item,index)=>{const Icon=item.icon;return <button key={item.label} className={`step-item ${index===step?'active':''} ${index<step?'complete':''}`} onClick={()=>go(index)}><span className="step-icon">{index<step?<Check size={18}/>:<Icon size={18}/>}</span><span>{item.label}</span></button>})}</nav>
        <div className="sidebar-tip"><Sparkles size={18}/><p><strong>Lapi's tip</strong>Never share your new password. Kelly will only provide a temporary password.</p></div>
      </aside>

      <section className="workspace onboarding-workspace">
        <div className="mobile-progress"><span>Step {step + 1} of {steps.length}</span><Progress value={((step+1)/steps.length)*100}/></div>
        <div className="form-column onboarding-column">
          <div className="experience-meta"><div className="eyebrow"><Sparkles size={15}/> Guided by Lapi</div><span className="time-pill">About 5 min</span></div>
          <h1>{steps[step].label}</h1>
          <p className="intro">Complete this quick check before moving to the next step.</p>

          <div className="progress-summary"><div><span>YOUR PROGRESS</span><strong>{Math.round(((step+1)/steps.length)*100)}% complete</strong></div><Progress value={((step+1)/steps.length)*100}/></div>

          <div className="form-card onboarding-card">
            {step===0&&<div className="checklist-screen">
              <h2>Are you ready to get started?</h2><p>Confirm these two items:</p>
              <label className="big-check"><Checkbox checked={questionsDone} onCheckedChange={v=>setQuestionsDone(v===true)}/><span><strong>Have you answered the initial questions?</strong><small>These are the questions sent by the recruiting team.</small></span></label>
              <label className="big-check"><Checkbox checked={recruiterKnown} onCheckedChange={v=>setRecruiterKnown(v===true)}/><span><strong>Do you know who your recruiter is?</strong><small>Keep their name or contact information handy.</small></span></label>
            </div>}

            {step===1&&<DecisionScreen icon={<Search/>} title="Check your email" description="Look for a message with one of these subject lines:" terms={emailTerms} question="Did you find the email?" answer={answer} setAnswer={setAnswer}/>} 

            {step===2&&<DecisionScreen icon={<CheckCircle2/>} title="Complete the paperwork" description="Open the link in the email, fill in all the requested information, and submit it. You should see a confirmation message when you finish." question='Did you see the “Congratulations” message?' answer={answer} setAnswer={setAnswer}/>} 

            {step===3&&<DecisionScreen icon={<Mail/>} title="Look for the second email" description="After completing the first paperwork, check your inbox again. Look for an email from:" terms={['Kelly I-9', 'GryphonHR']} question="Did you receive the email with the link?" answer={answer} setAnswer={setAnswer}/>} 

            {step===4&&<div className="instruction-screen">
              <span className="instruction-icon"><KeyRound/></span><h2>Open the link and sign in</h2><ol><li><span>1</span><p><strong>Username</strong>Enter your email address.</p></li><li><span>2</span><p><strong>Temporary password</strong>Use the temporary password provided by Kelly or your representative.</p></li><li><span>3</span><p><strong>Create a new password</strong>Enter the temporary password first. The system will then ask you to create a personal password.</p></li></ol><div className="security-note"><ShieldCheck/><span><strong>Important:</strong> change the temporary password immediately. Never share your new personal password.</span></div>
            </div>}

            {step===5&&<div className="instruction-screen final-screen">
              <span className="instruction-icon"><Pencil/></span><h2>Go to “My Stuff”</h2><p>Inside the portal, open <strong>My Stuff</strong> and look for the small pencil icon to edit your information.</p><div className="path-visual"><span>My Stuff</span><ChevronRight/><span className="pencil-target"><Pencil/> Pencil</span><ChevronRight/><span>Complete your information</span></div><div className="ready-message"><CheckCircle2/><div><strong>You're ready to begin!</strong><span>Complete every section and save your changes before leaving.</span></div></div>
            </div>}

            {answer==='no'&&<div className="representative-box"><CircleHelp/><div><strong>This email has not arrived yet</strong><p>Let one of our representatives know so they can check your process. Also check your Spam and Junk folders.</p><Button variant="outline" onClick={()=>setAnswer(null)}>Check again</Button></div></div>}
          </div>

          <div className="form-actions"><Button variant="outline" disabled={step===0} onClick={()=>go(step-1)}><ChevronLeft/> Back</Button><Button className="continue-button" disabled={!canContinue || answer==='no'} onClick={()=>go(step+1)}>{step===steps.length-1?'Start paperwork':'Next'} <ChevronRight/></Button></div>
        </div>

        <aside className="mascot-panel" aria-live="polite"><div className="mascot-status"><span></span> Lapi is here</div><div className="speech-bubble">{helper}</div><div className="mascot-halo"><span className="orbit orbit-one"></span><span className="orbit orbit-two"></span><img src="/lapi.png" alt="Lapi, the Sub Helper pencil mascot"/></div><div className="mascot-name"><strong>Lapi</strong><span>Your onboarding helper</span></div></aside>
      </section>
    </div>
  </main>;
}

function DecisionScreen({icon,title,description,terms=[],question,answer,setAnswer}:{icon:React.ReactNode;title:string;description:string;terms?:string[];question:string;answer:'yes'|'no'|null;setAnswer:(value:'yes'|'no')=>void}) {
  return <div className="decision-screen"><span className="instruction-icon">{icon}</span><h2>{title}</h2><p>{description}</p>{terms.length>0&&<div className="search-terms">{terms.map(term=><span key={term}><Mail size={16}/>{term}</span>)}</div>}<div className="decision-question"><strong>{question}</strong><div><Button variant={answer==='yes'?'default':'outline'} onClick={()=>setAnswer('yes')}><Check/> Yes, I found it</Button><Button variant={answer==='no'?'destructive':'outline'} onClick={()=>setAnswer('no')}>No, not yet</Button></div></div></div>;
}
