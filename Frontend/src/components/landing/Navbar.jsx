import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Security', href: '/security' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 border-b border-white/55 bg-white/78 backdrop-blur-xl'>
      <nav className='mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8'>
        <Link to='/' className='flex items-center gap-3'>
          <div className='grid h-10 w-10 place-items-center rounded-xl bg-(--ms-primary) text-sm font-bold text-white'>
            MS
          </div>
          <span className='text-lg font-semibold tracking-tight text-(--ms-ink)'>Medicare Secure</span>
        </Link>

        <ul className='hidden items-center gap-6 md:flex'>
          {navLinks.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-(--ms-primary) ${
                    isActive ? 'text-(--ms-primary)' : 'text-(--ms-muted)'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className='hidden items-center gap-3 md:flex'>
          <Link
            to='/contact'
            className='rounded-full border border-(--ms-border) px-4 py-2 text-sm font-semibold text-(--ms-primary) transition hover:border-(--ms-primary)'
          >
            Get Started
          </Link>
          <Link
            to='/login'
            className='rounded-full bg-(--ms-primary) px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-(--ms-primary-strong)'
          >
            Login
          </Link>
        </div>

        <button
          type='button'
          onClick={() => setIsOpen((prev) => !prev)}
          className='inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--ms-border) text-(--ms-primary) md:hidden'
          aria-label='Toggle navigation menu'
        >
          <span className='sr-only'>Menu</span>
          <div className='flex w-5 flex-col gap-1'>
            <span className='h-0.5 w-full bg-current' />
            <span className='h-0.5 w-full bg-current' />
            <span className='h-0.5 w-full bg-current' />
          </div>
        </button>
      </nav>

      {isOpen && (
        <div className='border-t border-white/55 bg-white/95 px-5 py-4 md:hidden'>
          <ul className='flex flex-col gap-3'>
            {navLinks.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-sm font-semibold ${
                      isActive
                        ? 'bg-teal-50 text-(--ms-primary)'
                        : 'text-(--ms-muted) hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className='mt-4 grid grid-cols-2 gap-2'>
            <Link
              to='/contact'
              onClick={() => setIsOpen(false)}
              className='rounded-full border border-(--ms-border) px-4 py-2 text-center text-sm font-semibold text-(--ms-primary)'
            >
              Get Started
            </Link>
            <Link
              to='/login'
              onClick={() => setIsOpen(false)}
              className='rounded-full bg-(--ms-primary) px-4 py-2 text-center text-sm font-semibold text-white'
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
