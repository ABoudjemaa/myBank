<?php

namespace App\Tests;


class CategoryPost extends Helper
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
