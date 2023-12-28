
### 构建阶段 ###
# 使用官方的node18; alpine是轻量级的linux
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 拷贝package.json到工作目录
COPY package.json .

# 设置npm镜像
RUN npm config set registry https://registry.npmmirror.com/

# 全局安装pnpm
RUN npm install -g pnpm@8

# 只安装生产依赖，因为我们只需要他跑打包后的文件
RUN pnpm i 

# 复制项目文件到工作目录
COPY . .

RUN pnpm build

### 生产阶段 ###
FROM node:18-alpine as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/.config /app/.config
COPY --from=build-stage /app/.config /.config

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install -g cross-env 
#两个阶段不共用pnpm，而且不知道为什么pnpm安装的大了很多

RUN npm install --prod

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "/app/main.js" ]