<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UserContextService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class MeController extends AbstractController
{
    public function __construct(
        private UserContextService $userContextService,
    )
    {
    }

    public function __invoke(Request $request): JsonResponse
    {

        $user = $this->userContextService->getAuthenticatedUser();


        return new JsonResponse($this->getUserData($user));
    }

    public function getUserData(User $user): array
    {
        $responseData = [
            'id' => $user->getId(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ];

        foreach ($user->getRoles() as $role) {
            $method = 'get' . ucfirst(strtolower(str_replace('ROLE_', '', $role)));
            if ($method != 'getUser' && method_exists($this, $method)) {
                $responseData[strtolower(str_replace('ROLE_', '', $role))] = $this->$method($user);
            }
        }

        return $responseData;
    }
}