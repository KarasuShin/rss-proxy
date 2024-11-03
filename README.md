
分享RSSHub私有实例的订阅源时，会暴露实例的ACCESS_KEY，做一个转发，隐藏真实的订阅地址

```
pnpm install
pnpm dlx prisma migrate dev --name init
pnpm run dev
```