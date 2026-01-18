// ==UserScript==
// @name        Hide Impressions on Syosetukaninarou
// @name:ja     小説家になろう感想非表示
// @author      kyagoshi
// @description Hides impression elements on Syosetu sites.
// @description:ja 小説家になろう・ノクターンノベルズの感想欄を非表示にします。
// @include     https://ncode.syosetu.com/*/*/
// @include     https://novel18.syosetu.com/*/*/
// @version     0.1
// @require     api
// ==/UserScript==

SLEX_addStyle('.p-new-impression { display: none !important; }');
