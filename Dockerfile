FROM node:18.12.1

WORKDIR /digital-guafak-website

COPY ./ /digital-guafak-website/

RUN npm install

CMD ["/bin/bash"]