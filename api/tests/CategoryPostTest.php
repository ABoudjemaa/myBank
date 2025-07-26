<?php

namespace App\Tests;


class CategoryPostTest extends Helper
{
    public function testSomething(): void
    {
        $response = $this->createUserClient()->request('GET', '/api/categories');

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            "@context" => "/api/contexts/Category",
            "@id" => "/api/categories",
            "@type" => "Collection",
        ]);
    }
}
