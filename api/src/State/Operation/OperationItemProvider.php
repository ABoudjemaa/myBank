<?php

namespace App\State\Operation;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\CategoryRepository;
use App\Repository\OperationRepository;
use App\Service\UserContextService;

class OperationItemProvider implements ProviderInterface
{
    public function __construct(
        private readonly OperationRepository $operationRepository,
        private readonly UserContextService $userContextService,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|null|object
    {
        $user = $this->userContextService->getAuthenticatedUser();
        return $this->operationRepository->findOneByIdAndUser($user, $uriVariables['id']);
    }

}
