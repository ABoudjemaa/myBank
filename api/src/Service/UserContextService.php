<?php

namespace App\Service;


use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use \Symfony\Component\Security\Core\User\UserInterface;

class UserContextService
{
    public function __construct(
        private Security $security,
        private UserRepository $userRepository
    ) {}

    public function getUser(): UserInterface | null
    {
        return $this->security->getUser();
    }

    public function isAdmin(): bool
    {
        return $this->security->isGranted('ROLE_ADMIN');
    }
    public function isLearner(): bool
    {
        return $this->security->isGranted('ROLE_LEARNER');
    }
    public function isFormative(): bool
    {

        return $this->security->isGranted('ROLE_FORMATIVE');
    }

    public function getAuthenticatedUser(): User
    {
        $userEmail = $this->getUser()->getUserIdentifier();
        $user = $this->userRepository->findOneByEmail($userEmail);

        if (!$user) {
            throw new \RuntimeException('User not found in database.');
        }

        return $user;
    }
}
