import React from "react";
import { Helmet } from "react-helmet";

const DynamicMeta = ({ title, description, image }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
        </Helmet>
    );
};

export default DynamicMeta;
