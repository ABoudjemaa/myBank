<?php

namespace App\Persister;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserPersister
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function save(User $user): void
    {
        $this->em->persist($user);
        $this->em->flush();
    }
}
