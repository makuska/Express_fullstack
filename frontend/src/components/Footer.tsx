function Footer() {
    return(
        <div className="footer">
            <div className="heading">
                <h2>FooterHeader<sup>™</sup></h2>
            </div>
            <div className="content">
                <div className="services">
                    <h4>Services</h4>
                    <p><a href="">kv.ee</a></p>
                    <p><a href="">city24.ee</a></p>
                </div>
                <div className="social-media">
                    <h4>Social</h4>
                    <p>
                        <a href="https://github.com/">Github</a>
                    </p>
                </div>
                <div className="links">
                    <h4>Quick links</h4>
                    <p><a href="">Home</a></p>
                    <p><a href="">About</a></p>
                    <p><a href="">Contact</a></p>
                </div>
                <div className="details">
                    <h4 className="address">Address</h4>
                    <p>
                        Lorem ipsum dolor sit amet consectetur <br />
                        adipisicing elit. Cupiditate, qui!
                    </p>
                </div>
            </div>
            <footer>
                <hr />
                © 2023 s.
            </footer>
        </div>
    )
}

export default Footer;