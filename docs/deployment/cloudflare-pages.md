# Cloudflare Pages 部署说明

更新时间：2026-06-30

## 构建配置

- Framework preset：Vite / React
- Build command：`npm run build`
- Build output directory：`dist`
- Production branch：`main`
- Node 版本：建议使用当前本地验证版本 `v24.16.0`，或 Cloudflare Pages 支持的最新 LTS/Current Node 版本。

## 环境变量

MVP 不需要业务环境变量。

不要在前端或 Pages 环境变量里放 image2、imagegen、统计服务、广告或联盟平台密钥。后续如果要接入这些能力，需要先设计后端代理或 Pages Functions，并重新做安全评估。

## 静态 headers

`public/_headers` 会随 Vite 构建复制到 `dist/_headers`，当前配置：

- hashed assets：`Cache-Control: public, max-age=31536000, immutable`
- 全站：`X-Content-Type-Options: nosniff`
- 全站：`Referrer-Policy: strict-origin-when-cross-origin`
- 全站：关闭 camera / microphone / geolocation 权限

## 发布前门禁

发布前至少确认：

- `npm test -- --run`
- `npm run typecheck`
- `npm run build`
- 移动端截图覆盖 375x812、390x844、430x932。
- 桌面兜底截图覆盖 1280x900。
- 分享卡保存 PNG 为 1080x1350。
- 页面不登录、不采集个人身份信息、不上传答案。
- 页面不包含广告、付费报告、购买诱导、生产凭据或浏览器端模型 API 调用。

## 回滚

Cloudflare Pages 生产部署后，记录部署 commit SHA 和 production URL。若线上验收失败，使用 Cloudflare Pages 的 deployment rollback 回滚到最近一次成功的 production deployment。
