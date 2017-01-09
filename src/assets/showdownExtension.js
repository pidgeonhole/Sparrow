import Prism from './prism/prism'
import katex from './katex/katex.min'

export const syntaxHighlighter = function () {
    return [
        {
            type: 'html',
            filter: function (html) {
                let regex = /<pre>\s*<code class="(\S+)[\s\w\-]*">([\s\S]*)<\/code><\/pre>/g;
                let result;

                while ((result = regex.exec(html)) !== null) {
                    let lang = result[1];
                    let code = result[2];

                    code = code.replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&');

                    let grammer = Prism.languages[lang];

                    if (!grammer) {
                        continue;
                    }

                    let highlightedCode = Prism.highlight(code, grammer, lang);
                    let newHtml = `
<pre class="language-${lang}">
<code>${highlightedCode}</code>
</pre>`;
                    let oldHtml = result[0];
                    let oldHtmlIndex = result.index;

                    let beforeOldHtml = html.substring(0, oldHtmlIndex);
                    let afterOldHtml = html.substring(oldHtmlIndex + oldHtml.length);

                    html = beforeOldHtml + newHtml + afterOldHtml;

                    regex.lastIndex = oldHtmlIndex + newHtml.length;
                }
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
                return text.replace(/\`katex\s([\S ]*)[\s]?\`/g, function (flag, match, end) {
                    return katex.renderToString(match)
                })
            }
        }, {
            type: 'lang',
            filter: function (text) {
                return text.replace(/```katex\n([\S]+)\n```/g, function (flag, match, end) {
                    return katex.renderToString(match)
                })
            }
        }];
};
