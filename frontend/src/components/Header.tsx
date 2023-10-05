import {useEffect, useState} from "react";
import { Link } from 'react-router-dom'

function Header() {
    const [scrollDirection, setScrollDirection] = useState<string>('')

    useEffect(() => {
        let lastScrollY: number = window.pageYOffset;

        const updateScrollDirection = () => {
            const scrollY: number = window.pageYOffset;
            const direction: string = scrollY > lastScrollY ? "down" : "up";
            if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
                setScrollDirection(direction.toString());
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };

        window.addEventListener("scroll", updateScrollDirection);
        return () => {
            window.removeEventListener("scroll", updateScrollDirection);
        }

    }, [scrollDirection]);
    console.log(scrollDirection)

    return(
      <div className={`header ${scrollDirection === "down" ? "hide" : ""}`}>
          {/*{console.log(document.getElementsByClassName('header hide'))}*/}
          <Link to="/" className="logo">CompanyLogo</Link>
          <div className="header-right">
              <a href="http://localhost:8080/isUser">Protected resource</a>
              <Link className="active" to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/about">About</Link>
          </div>
      </div>
    )
}

export default Header