<?php

namespace App\Tests;
use Doctrine\ORM\EntityManagerInterface;


class DatabaseTest extends  Helper
{
    public function testDatabaseIsConnected(): void
    {
        /** @var EntityManagerInterface $em */
        $em = self::getContainer()->get(EntityManagerInterface::class);

        $connection = $em->getConnection();

        $this->assertTrue($connection->isConnected() || $connection->connect());

        $result = $connection->executeQuery('SELECT 1')->fetchOne();
        $this->assertEquals(1, $result);
    }
}
