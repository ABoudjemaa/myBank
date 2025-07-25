'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {useGetOperations} from "@/hooks/get/use-get-operations";
import {formatDate} from "@/lib/utils";
import Link from "next/link";
import Loading from "@/components/loading";
import Error from "@/components/Error";


const OperationsList = () => {
  const { operations, loading, error } = useGetOperations();

  if (loading) return <Loading/>
  if (error) return <Error error={error}/>;

  return (
    <div className="container mx-auto py-6">
      <div className='flex justify-between items-center p-5'>
        <h1 className="text-2xl font-bold text-center">Operations</h1>
        <div className="text-center">
          <Button asChild>
            <Link href="/operations/create">Create New Operation</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5">
        {operations && operations.map((operation) => (
          <Card key={operation.id} className="shadow-md">

            <CardContent className="flex justify-between items-center p-5">
              <h2 className='font-bold'>{operation.label}</h2>
              <p className="text-sm text-gray-600">Amount: {operation.amount}€</p>
              <p className="text-sm text-gray-500">Date: {formatDate(operation.date)}</p>
              <div className='flex gap-2'>
                <Button variant="secondary" asChild>
                  <Link href={`/operations/edit/${operation.id}`}>Edit</Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this operation?</p>
                    <DialogFooter>
                      <DialogClose  className=' border border-gray-300 rounded-md px-3 py-1 mr-2'>
                        Cancel
                      </DialogClose>
                      <Button
                        variant="destructive"
                        // onClick={() => deleteOperation(operation.id)}
                      >
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>

          </Card>

        ))}
      </div>

    </div>
  );
};

export default OperationsList;
