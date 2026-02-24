# 📅 カレンダーWebアプリ（Next.js / TypeScript）

Google Calendar を参考に開発したカレンダーWebアプリケーションです。

URLベースのページ遷移設計を採用し、
月・週・日単位での表示切り替え、
予定のCRUD機能、データ永続化まで実装しています。



## 🌐 デモ環境

https://nextjs-ts-calendar-sable.vercel.app/



## 🛠 使用技術

- Next.js（App Router）
- TypeScript
- date-fns
- Prisma
- PostgreSQL（Neon）
- Vercel



## 💻 主な機能

### ■ カレンダー表示

- デフォルトで現在月を表示
- 前月 / 翌月の切り替え
- 今日の日付をハイライト表示
- 月表示 / 週表示 / 日表示の切り替え



### ■ URLベース設計

動的ルーティングによるページ遷移型設計。

- 月表示  
  `/month/[year]/[month]`

- 週表示  
  `/week/[year]/[month]/[day]`

- 日表示  
  `/day/[year]/[month]/[day]`

URLパラメータを単一の状態管理ソースとし、
date-fns を用いて日付計算を行っています。



### ■ 予定管理機能（CRUD）

- 予定作成（モーダル）
- 予定編集（タイトル変更）
- 予定削除
- 月・週・日表示すべてにリアルタイム反映



### ■ データ永続化

Prisma を用いて PostgreSQL に保存。
リロード後も予定が保持されます。


## 💡 実装上の工夫

- URLを状態管理の中心とした設計
- date-fns による安全で明確な日付計算
- App Router を活用した責務分離設計
- コンポーネント分割による再利用性向上
- シンプルかつ拡張可能なイベントモデル設計
