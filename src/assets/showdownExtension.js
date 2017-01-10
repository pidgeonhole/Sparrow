import Prism from './prism/prism'
import katex from './katex/katex.min'

export const syntaxHighlighter = function () {
    return [
        {
            type: 'html',
            filter: function (html) {
                let regex = /<pre>\s*<code class="(\S+)[\s\w\-]*">([\s\S]*)<\/code><\/pre>/g;

                let matches = html.match(regex);

                if (!matches)
                    return html;
                matches[0].split('</pre>').forEach(e => {

                    regex = /<pre>\s*<code class="(\S+)[\s\w\-]*">([\s\S]*)<\/code><\/pre>/g;
                    if (e.length > 0) {
                        let match = e.substr(e.search("<pre>")) + "</pre>";
                        let rg = regex.exec(match);
                        let lang = rg[1];

                        if (lang === 'katex')
                            return;


                        let code = rg[2].replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&amp;/g, '&');

                        let grammer = Prism.languages[lang];

                        if (!grammer)
                            return;

                        let highlightedCode = Prism.highlight(code, grammer, lang);
                        let newHtml = `
<pre class="language-${lang}">
<code>${highlightedCode}</code>
</pre>
`;
                        html = html.replace(match, newHtml);
                    }
                });

                return html;
            }
        }
    ]
};


export const katexConverter = function () {
    return [
        {
            type: 'lang',
            filter: function (text) {
                return text.replace(/\`katex\s([\S ]*)[\s]?`/g, function (flag, match, end) {
                    return katex.renderToString(match)
                });
            }
        }, {
            type: 'lang',
            filter: function (text) {
                try {
                    return text.replace(/```katex[\s\n]*([\S\s]+)[\s\n]*```/g, function (flag, match, end) {
                        return katex.renderToString(match)
                    });
                } catch (e) {
                    return text;
                }

            }
        }];
};
