import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Context_provider";
import data from "../pages/translate";
const Footer = () => {
    let { settranslate_value, translate_value, lang, setLang } = useContext(Context)
    const translate = (x) => {
        if (x === "ge") {
            settranslate_value(data.ge);
            setLang("ge");
        } else {
            settranslate_value(data.en);
            setLang("en");
        }
    };
    return (
        <>
            <div className="bg-light w-100 d-none d-lg-block border-top" style={{ height: '80px', position: 'absolute', bottom: 0 }}>
                <div className="container h-100">
                    <div className="pe-2 d-flex justify-content-between py-2 py-lg-0 gap-2 flex-column flex-lg-row align-items-center h-100">
                        <ul className="nav d-flex gap-4">
                            <li><Link to={'https://www.iubenda.com/terms-and-conditions/43142553'} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>{translate_value.system_footer.termsuse}</Link></li>
                            <li><Link to={'https://www.iubenda.com/privacy-policy/43142553'} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>{translate_value.system_footer.privacy}</Link></li>
                            <li><Link to={'/our_team'} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>{translate_value.system_footer.about}</Link></li>
                            <li><Link to={'https://www.iubenda.com/privacy-policy/43142553/cookie-policy'} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>{translate_value.system_footer.privacy_settings}</Link></li>
                        </ul>
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex gap-2 align-items-center">
                                <a className=" text-decoration-none"><i className="fas fa-globe"></i>&nbsp;</a>
                                <select className="border px-2 py-1" value={lang} onChange={(e) => translate(e.target.value)}>
                                    <option value={'en'}>EN</option>
                                    <option value={'ge'}>DE</option>
                                </select>
                            </div>
                        </div>
                        <div>Copyright © lernenhub 2025</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer;