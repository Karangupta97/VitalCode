import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='border-t border-white/65 bg-white/65 px-5 py-8 backdrop-blur md:px-8'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-(--ms-muted)'>
          © {new Date().getFullYear()} Medicare Secure. All rights reserved.
        </p>
        <div className='flex flex-wrap items-center gap-4'>
          <Link to='/security' className='text-sm font-medium text-(--ms-muted) hover:text-(--ms-primary)'>
            Privacy
          </Link>
          <Link to='/about' className='text-sm font-medium text-(--ms-muted) hover:text-(--ms-primary)'>
            Terms
          </Link>
          <Link to='/contact' className='text-sm font-medium text-(--ms-muted) hover:text-(--ms-primary)'>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
