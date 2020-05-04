FROM node:12.13.1
RUN mkdir -p /home/outbreak/
WORKDIR /home/outbreak/
ADD . /home/outbreak
RUN chmod +x ./wait-for-it.sh
RUN npm config set registry https://registry.npm.taobao.org \
    && npm i
