<?php

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;


abstract class Helper extends ApiTestCase
{
    private ?string $token = null;

    public function setUp(): void
    {
        self::bootKernel();
    }

    private function getToken($body): string
    {
        if ($this->token) {
            return $this->token;
        }

        $response = static::createClient()->request('POST', '/api/login', ['json' => $body]);

        $this->assertResponseIsSuccessful();
        $data = $response->toArray();
        $this->token = $data['token'];

        return $data['token'];
    }

    protected function getUserToken(): string
    {
        return $this->getToken([
            'username' => "boudjemaa.amine.2003@gmail.com",
            'password' => "12345678",
        ]);
    }


    private function createClientWithCredentials($token): Client
    {
        return static::createClient([], [
            'headers' => ['authorization' => 'Bearer ' . $token]

        ]);
    }

    protected function createUserClient(): Client
    {
        return $this->createClientWithCredentials($this->getUserToken());
    }

}