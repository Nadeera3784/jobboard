import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import Footer from '../Footer/Footer'
import Header from '../Header/Header'

const Layout = (props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
    return (
      <div className="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
          <Header/>
          {props.children}
          <Footer/>
      </div>
    )
  }
  
  export default Layout;
  