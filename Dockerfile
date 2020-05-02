FROM node:12.13.1
RUN mkdir -p /home/outbreak/
WORKDIR /home/outbreak/
ADD . /home/outbreak
RUN npm config set registry https://registry.npm.taobao.org \
    && npm i
CMD npm start