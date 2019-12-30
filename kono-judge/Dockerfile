FROM python:3.8.1
MAINTAINER inhibitor <inhibitor@kaist.ac.kr>

WORKDIR /usr/src/

ADD requirements.txt .
ADD src/ .
ADD .env .

RUN pip3 install -r requirements.txt

EXPOSE 7077
EXPOSE 7078

CMD [ "python3", "/usr/src/judge.py" ]