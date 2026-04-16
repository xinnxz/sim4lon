import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable GZIP compression for faster response times
    app.use(compression({
        filter: (req, res) => {
            // Don't compress if 'x-no-compression' header is present
            if (req.headers['x-no-compression']) {
                return false;
            }
            // Compress all responses
            return compression.filter(req, res);
        },
        threshold: 1024, // Only compress responses > 1KB
    }));

    // Increase body size limit for logo uploads (base64 images)
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

    // Enable CORS with caching
    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        maxAge: 86400, // Cache CORS preflight for 24 hours
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 SIM4LON Backend is running on: http://localhost:${port}/api`);
    console.log(`📦 Compression enabled for faster responses`);
}

bootstrap();

