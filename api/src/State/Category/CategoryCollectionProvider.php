<?php

namespace App\State\Category;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\CategoryRepository;
use App\Service\UserContextService;

class CategoryCollectionProvider implements ProviderInterface
{
    public function __construct(
        private readonly CategoryRepository $categoryRepository,
        private readonly UserContextService $userContextService,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|null|object
    {
        $user = $this->userContextService->getAuthenticatedUser();
        return $this->categoryRepository->findByUser($user);
    }

}
