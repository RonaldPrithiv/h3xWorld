import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignOutButton, OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import dark from '@clerk/themes'

const Topbar = () => {
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'> 
        <Image src='/download.jpeg' alt='logo' width={30} height={30}/>
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>h3xWorld</p>
      </Link>

      <div className='flex items-center gap-1'>
        <div className='block md:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image src="/assets/logout.svg" alt='logout' width={24} height={24}/>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />
        <UserButton afterSignOutUrl="/"/>

      </div>

    </nav>
  )
}

export default Topbar