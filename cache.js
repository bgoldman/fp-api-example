import Redis from 'ioredis';

const cache = () => new Redis();

const conn = cache();

export default () => conn;
