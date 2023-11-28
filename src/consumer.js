require("dotenv").config();
const config = require("./utils/config");
const amqp = require("amqplib");
const SongsService = require("./SongsService");
const MailSender = require("./MailSender");
const Listener = require("./listener");

const init = async () => {
  const songsService = new SongsService();
  const mailSender = new MailSender();
  const listener = new Listener(songsService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:songs", {
    durable: true,
  });

  channel.consume("export:songs", listener.listen, { noAck: true });
};

init();
