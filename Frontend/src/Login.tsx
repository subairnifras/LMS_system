import { useState } from 'react'
import type { FormEvent } from 'react'
import { BookOpen, Check, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, Moon, Sun } from 'lucide-react'
// @ts-ignore CSS is loaded by the bundler; no TypeScript declaration is needed here.
import './login.css'

type LoginProps = {
  onLogin: () => void
  theme: string
  onToggleTheme: () => void
}

export default function Login({ onLogin, theme, onToggleTheme }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [help, setHelp] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim().toLowerCase() !== 'student@learnspace.demo' || password !== 'LearnSpace123') {
      setError('Use the demo account below to explore LearnSpace.')
      return
    }
    onLogin()
  }

  function fillDemo() {
    setEmail('student@learnspace.demo')
    setPassword('LearnSpace123')
    setError('')
  }

  return <div className="login-page">
    <section className="login-story" aria-label="About LearnSpace">
      <a className="login-brand" href="#login"><span><GraduationCap size={27}/></span>LearnSpace</a>
      <div className="login-story-copy">
        <p className="login-kicker">A LITTLE PROGRESS. EVERY DAY.</p>
        <h1>Your next chapter<br/>starts here.</h1>
        <p>Your courses, your goals, your learning journey.<br className="desktop-break"/> All together in one space.</p>
      </div>
      <div className="learning-scene" aria-hidden="true">
        <div className="scene-orbit"/>
        <div className="scene-course">
          <div className="scene-course-top"><span><BookOpen size={24}/></span><span>MY LEARNING</span><span className="scene-dots">•••</span></div>
          <h2>One step closer.</h2><p>Keep your curiosity going.</p>
          <div className="scene-progress"><span/></div>
          <div className="scene-progress-meta"><span>Course progress</span><b>75%</b></div>
          <div className="scene-lesson"><span><Check size={16}/></span><div><b>Learn something new</b><small>Lesson completed</small></div></div>
          <div className="scene-lesson"><span><BookOpen size={16}/></span><div><b>Put it into practice</b><small>Your next lesson</small></div></div>
        </div>
        <div className="scene-achievement"><span><GraduationCap size={24}/></span><div><b>Made for your next step</b><small>Learn at your own pace</small></div></div>
      </div>
      <p className="login-story-footer">A space to learn. A place to grow.</p>
    </section>

    <section className="login-form-panel" aria-labelledby="login-title">
      <button className="icon-btn login-theme" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={21}/> : <Moon size={21}/>}</button>
      <div className="login-form-inner" id="login">
        <span className="login-welcome-icon"><GraduationCap size={28}/></span>
        <p className="login-form-kicker">WELCOME TO LEARNSPACE</p>
        <h2 id="login-title">Welcome back.</h2>
        <p className="login-subtitle">Log in to continue your learning journey.</p>
        <form onSubmit={submit}>
          <label htmlFor="login-email">Email address</label>
          <div className="login-input"><Mail size={19}/><input id="login-email" type="email" autoComplete="off" placeholder="student@learnspace.demo" value={email} required onChange={event=>{setEmail(event.target.value);setError('')}} aria-describedby="demo-note"/></div>
          <div className="login-label-row"><label htmlFor="login-password">Password</label><button type="button" onClick={()=>setHelp(!help)} aria-expanded={help}>Forgot password?</button></div>
          <div className="login-input"><LockKeyhole size={19}/><input id="login-password" type={visible ? 'text' : 'password'} autoComplete="off" placeholder="Enter your password" required value={password} onChange={event=>{setPassword(event.target.value);setError('')}}/><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div>
          {help && <p className="login-message" role="status">For this frontend preview, use the demo account below. Account recovery will be available when authentication is connected.</p>}
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit">Log in</button>
        </form>
        
      </div>
      <p className="login-copyright">© 2026 LearnSpace</p>
    </section>
  </div>
}
