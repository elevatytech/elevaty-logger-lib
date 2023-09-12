import { config } from 'dotenv';
import  { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { hostname, platform } from 'os';
const chalk = require('chalk');

config();

interface Configure {
  region?: string;
  queueUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
  application?: string;
  host?: string;
  time?: string;
}

interface Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

class LogSender {
  static instance: LogSender;
  client: any;
  queueUrl: string;
  params: {};

  constructor() {
    if (LogSender.instance) {
      return LogSender.instance;
    }

    LogSender.instance = this;
    return this;
  }

  configure({
    region,
    queueUrl,
    accessKeyId,
    secretAccessKey,
    application,
    host,
    time
  }: Configure) {
    const config: Config = {
        accessKeyId: accessKeyId || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || '',
        region: region || process.env.REGION
    };
    this.client = new SQSClient(config);
    this.queueUrl  = queueUrl;
    if (!host) {
      host = hostname();
    }
    if (!time) {
      time = new Date().toISOString();
    }
    if (!application) {
      application = platform();
    }
    const params = {
      application,
      host,
      time,
    }
    this.params = Object.keys(params).reduce((acc, key) => {
      if (params[key] !== null && params[key] !== '') {
        acc[key] = params[key];
      }
      return acc;
    }, {});
  }

  validateObjectLog(log: any) {
    if (!log?.level) {
      throw new Error('Required fields missing from log');
    }
  }

  printLog(print: any) {
    console.log(chalk.green('Logs:'));
    if (typeof print === 'object' && Object.keys(print).length > 0) {
      console.log(chalk.green(JSON.stringify(print, null, 2)));
    }
    console.log('\n');
  }

  async sendLog(log: {}) {
    this.validateObjectLog(log);
    try {
      const params = {
        MessageBody: JSON.stringify({ ...this.params, ...log }),
        QueueUrl: this.queueUrl,
      };
      const command = new SendMessageCommand(params);
      const result = await this.client.send(command);

      const data = {
        ...result,
        logDetails: { ...this.params, ...log },
      }
      this.printLog({
        ...this.params,
        ...log,
        MD5OfMessageBodySQS: data.MD5OfMessageBody,
        messageIdSQS: data.MessageId,
      });
      return data;
    } catch (error) {
      console.error('Error send SQS: ', error);
    }
  }
}

export const logSender = new LogSender();
