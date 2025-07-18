<?php

namespace App\State\Category;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Category;
use App\Service\UserContextService;

class CategoryPostProcessor implements ProcessorInterface
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

        $data->setCreatedBy($user);

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);


    }
}
