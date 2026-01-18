# Sleipnir Mobile Extensions 開発ガイド

このドキュメントは、Sleipnir Mobile for Android のエクステンション開発に必要な情報をまとめたものです。

## 目次

1. [概要](#概要)
2. [ファイルフォーマット](#ファイルフォーマット)
3. [メタデータ](#メタデータ)
4. [エクステンション API](#エクステンション-api)
5. [開発チュートリアル](#開発チュートリアル)
6. [インストール方法](#インストール方法)
7. [FAQ](#faq)

---

## 概要

エクステンションは **JavaScript** で開発します。[Greasemonkey](https://addons.mozilla.org/firefox/748/) スクリプトの仕様に倣っているため、Greasemonkey スクリプトを開発したことがあれば容易に理解できます。

---

## ファイルフォーマット

| 項目 | 仕様 |
|------|------|
| ファイル構成 | 1つのJavaScriptファイル |
| エンコード | **UTF-8** |
| ファイル名 | `*.slex.js` (必須) |

> **Note**: `*.slex.js` のリンクをアプリケーションで開くと、インストールダイアログが表示されます。

---

## メタデータ

メタデータは名前や作者名といったエクステンション自体の情報を定義するデータです。

### メタデータの記述形式

```javascript
// ==UserScript==
// @name            Sample extension
// @name:ja         サンプルエクステンション
// @author          fenrir_dev
// @description     This is a sample extension.
// @description:ja  サンプルエクステンションです。
// @icon            http://extensions.fenrir-inc.com/sample/icon.png
// @include         http://*.fenrir-inc.com/*
// @exclude         http://*.fenrir-inc.com/*/dev/*
// @version         0.2.1
// @history         0.2.1 Fixed some bugs.
// @history:ja      0.2.1 いくつかバグ修正。
// @require         jquery
// ==/UserScript==
```

### メタデータ一覧

| メタデータ | 説明 | 省略可 |
|-----------|------|--------|
| `@name <名前>` | 英語でのエクステンション名 | ✗ |
| `@name:ja <名前>` | 日本語でのエクステンション名 | ○ |
| `@author <名前>` | 英語での作者名 | ✗ |
| `@description <説明文>` | 英語での詳細説明 | ✗ |
| `@description:ja <説明文>` | 日本語での詳細説明 | ○ |
| `@icon <BASE64データ>` | アイコン（BASE64エンコードPNG、推奨サイズ128x128） | ○ |
| `@include <対象URL>` | 実行対象とするURL（ワイルドカード可、正規表現不可） | ✗ |
| `@exclude <除外URL>` | 実行対象から除外するURL（ワイルドカード可、正規表現不可） | ○ |
| `@version <バージョン番号>` | エクステンションのバージョン番号 | ✗ |
| `@history <バージョン番号> <説明>` | 英語での各バージョンの変更履歴（新しい順） | ○ |
| `@history:ja <バージョン番号> <説明>` | 日本語での各バージョンの変更履歴（新しい順） | ○ |
| `@require <機能名>` | 有効にするスクリプト機能を指定 | ○ |
| `@android-version <バージョン番号>` | 動作するAndroidのバージョンを指定 | ○ |
| `@origin <URL>` | 拡張ファイルのダウンロード元URL | ○ |
| `@gallery-id <ID>` | Extensions GalleryでのID（配布サイトが自動付加） | ○ |

### スクリプト機能一覧 (@require で指定可能)

| 機能名 | 説明 |
|--------|------|
| `api` | エクステンション API を利用可能にします。**信頼できないサイトを実行対象にする場合は使用しないでください。** |
| `jquery` | jQuery 1.7.1 を利用可能にします。 |
| `xpath` | XPath を利用可能にします。 |
| `api-notification` | 通知に関するエクステンション API を利用可能にします。（Sleipnir Mobile for Android 2.12 以上） |

### バージョン番号の制限

- ドットで区切られた数値の列で表す
- 最大 **4つ** の数値を使用可能
- 各数値の範囲は **[0, 65535]**

例:
- `1`
- `1.0`
- `2.20.2`
- `43.21.0.1234`

---

## エクステンション API

エクステンション API は、アプリケーションが提供する機能群です。利用には `@require api` または `@require api-notification` が必要です。

### SLEX_showNotification(text, [, callback])

アドレスバーに通知を表示します。

**必要な @require**: `api-notification` (Sleipnir Mobile for Android 2.12 以上)

```javascript
function myCallback() {
  alert('callback');
}
SLEX_showNotification('notification', myCallback);
```

### SLEX_addStyle(str)

CSS を追加します。

**必要な @require**: `api`

```javascript
SLEX_addStyle('body{font-size:24px;color:#000;} a:hover{text-decoration:underline;}');
```

### SLEX_httpGet(url [, data])

HTTP GET リクエストでサーバーからデータを取得し、文字列として返します。エラーの場合は `null` を返します。**クロスドメイン制約はありません。**

**必要な @require**: `api`

| 引数 | 説明 |
|------|------|
| `url` | リクエストを送信する URL |
| `data` | 送信するパラメータ（オプション） |

```javascript
SLEX_httpGet('http://en.wikipedia.org/wiki/Special:Search', {'search': 'android', 'go': 'Go'});
```

### SLEX_httpPost(url [, data])

HTTP POST リクエストでサーバーからデータを取得し、文字列として返します。エラーの場合は `null` を返します。**クロスドメイン制約はありません。**

**必要な @require**: `api`

| 引数 | 説明 |
|------|------|
| `url` | リクエストを送信する URL |
| `data` | 送信するパラメータ（オプション） |

```javascript
SLEX_httpPost('http://www.sleipnirstart.com/', {'keywd': 'aaa', 'eng': 'fs'});
```

### SLEX_download(url [, filename])

アプリケーションのダウンローダでファイルをダウンロードします。

**必要な @require**: `api`

| 引数 | 説明 |
|------|------|
| `url` | ダウンロードする URL |
| `filename` | ダウンロード先のファイル名（省略時は適当な名前） |

```javascript
SLEX_download("http://fenrir-inc.com/", "index.html");
```

### SLEX_shareUrl(url)

URL をインテントで別アプリケーションで開きます。

**必要な @require**: `api`

| 引数 | 説明 |
|------|------|
| `url` | 開く URL |

```javascript
SLEX_shareUri('http://m.sleipnirstart.com/');
```

### SLEX_shareText(text [, subject])

テキストをインテントで別アプリケーションに渡します。

**必要な @require**: `api`

| 引数 | 説明 |
|------|------|
| `text` | 送るテキスト |
| `subject` | 送る件名（省略可能） |

```javascript
SLEX_shareText('content', 'title');
```

### SLEX_locale

現在のロケール値の文字列変数。

**必要な @require**: `api`

**値**:
- `"en"` - 英語
- `"ja"` - 日本語

```javascript
var str_msg = "Message";
switch( SLEX_locale ) {
    case "ja":
        str_msg = "メッセージ";
        break;
}
```

---

## 開発チュートリアル

### 1. ソースファイルの作成

ファイル名は `*.slex.js` という形式にします。

例: `my_extension.slex.js`

### 2. メタデータの記入

ソースファイル冒頭にメタデータを記入します。

```javascript
// ==UserScript==
// @name        My Extension
// @author      Your Name
// @description My first extension.
// @include     http://example.com/*
// @version     0.1
// @require     jquery
// ==/UserScript==
```

### 3. プログラミング

メタデータの後にJavaScriptコードを記述します。

```javascript
// ==UserScript==
// @name        Sleipnir Start Simplifier
// @author      Nishida
// @description Simplifies Sleipnir Start.
// @include     http://m.sleipnirstart.com/
// @version     0.1
// @require     jquery
// ==/UserScript==

$("#kewdBox").remove();
$('#searchIcon').remove();
$('#PR').remove();
$('#copyright').remove();
$('#otherlink').remove();
```

### HTML要素の調べ方

HTML要素のIDを調べるには、**Webインスペクタ**を使用すると便利です。

- Sleipnir 3 for Windows では、レンダリングエンジンを Gecko に切り替えて [Firebug](http://getfirebug.com/) を利用可能
- 調べたい要素を右クリックして「要素を調査」を選択

---

## インストール方法

### 方法1: Dropbox を使用

1. 作成したエクステンションファイルを Dropbox にアップロード
2. Android の Dropbox アプリから Sleipnir Mobile for Android にインテントで渡す

### 方法2: メール添付

1. エクステンションファイルをメールに添付して送信
2. Sleipnir Mobile for Android で `mail.google.com` にアクセスして添付ファイルを開く

> **Note**: Gmail アプリだと添付ファイルを開けないことがあるため、ウェブ版Gmailを推奨

### インストール後のテスト

インストール後、`@include` で指定したURLにアクセスしてエクステンションが動作することを確認します。

---

## FAQ

### Q: @require で使える jQuery のバージョンは？

A: **1.7.1** です。

### Q: エクステンションの実行のタイミングは？

A: **ページ読み込み完了後**です。

実行順序: `DOMReady` → `window.onload` → `拡張スクリプト`

---

## 公開方法

作成したエクステンションは以下の方法で公開できます:

1. **Extensions Gallery への投稿**
   - `extensions@fenrir.co.jp` または Twitter [@fenrir_dev](http://twitter.com/fenrir_dev) に連絡

2. **自身のWebサイト/ブログで公開**

---

## 参考リンク

- [Extensions Gallery - エクステンション開発](http://extensions.fenrir-inc.com/dev.html)
- [15分で作れる Sleipnir Mobile for Android エクステンション作成チュートリアル](https://blog.fenrir-inc.com/jp/2012/02/sleipnir-android-2-0-create-extension.html)

---

## 変更履歴

| 日付 | 内容 |
|------|------|
| 2013-7-23 | メタデータ @require に `api-notification` 追加、エクステンションAPI `SLEX_showNotification` 追加 |
| 2012-2-21 | メタデータ `@android-version` 追加、`@author:ja` 削除、`@require xpath` 追加 |
