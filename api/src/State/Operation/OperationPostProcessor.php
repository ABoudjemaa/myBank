<?php

namespace App\State\Operation;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Service\UserContextService;

class OperationPostProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private UserContextService $userContextService,
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): \App\Entity\Operation
    {
        if (!($data instanceof \App\Entity\Operation)) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        $user = $this->userContextService->getAuthenticatedUser();
        if (!$user) {
            throw new \RuntimeException("User not authenticated.");
        }
        $data->setDate(new \DateTimeImmutable());
        $data->setCreatedBy($user);

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);


    }
}
