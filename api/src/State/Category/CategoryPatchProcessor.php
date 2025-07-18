<?php

namespace App\State\Category;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Category;
use App\Service\UserContextService;

class CategoryPatchProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private UserContextService $userContextService,
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Category
    {
        if (!($data instanceof Category)) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        $user = $this->userContextService->getAuthenticatedUser();

        $createdBy = $data->getCreatedBy();

        if ($createdBy && $createdBy->getId() !== $user->getId()) {
            throw new \RuntimeException("Vous ne pouvez pas modifier cette catégorie car vous n'êtes pas son créateur.");
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);


    }
}
