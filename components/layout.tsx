import Link from "next/link";
import { SearchBox } from "react-instantsearch-hooks-web";

export default function Layout({ children }) {
  return <div>
    <header className='header'>
      Menu
      <SearchBox searchAsYouType={false} />
    </header>
    {children}
    <footer className='d-flex footer'>
      {/* copilote génére moi une liste de liens pour avoir un footer style ecommerce */}
      <Link href='/'>Home</Link>
      <Link href='/faq'>FAQ</Link>
      <Link href='/cgv'>CGV</Link>
    </footer>
  </div>;
}