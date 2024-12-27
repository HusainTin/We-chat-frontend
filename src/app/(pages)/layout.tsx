import { NextPage } from 'next'
import { Suspense } from 'react';

interface Props {
    children: React.ReactNode;
  
}

const Layout: NextPage<Props> = ({children}) => {
  return (
    <>
        <Suspense>
        {children}
        </Suspense>
    </>
  )
}

export default Layout