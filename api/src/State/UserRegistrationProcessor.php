<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\UserRegisterInput;
use App\Entity\User;
use App\Factory\UserFactory;
use App\Persister\UserPersister;

class UserRegistrationProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly UserFactory   $userFactory,
        private readonly UserPersister $userPersister
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        if (!$data instanceof UserRegisterInput) {
            throw new \InvalidArgumentException('Expected UserRegisterInput.');
        }

        $user = $this->userFactory->createFromDto($data);
        $this->userPersister->save($user);

        return $user;
    }
}
