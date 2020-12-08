import React, { FC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { ArrowLeft } from 'react-feather'
import { DateTime } from 'luxon'

import { IProposal } from 'src/config'

import VoteStatusCard from './VoteStatusCard'
import ProposalStatusCard from './ProposalStatusCard'

import { VOTE_STATUS, PROPOSAL_LENGTH_IN_SECS } from 'src/config/constants'

const useStyles = makeStyles((theme) => ({
  componentBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    width: '51.6rem',
    marginTop: '4.2rem',
    marginBottom: '4.2rem',
    padding: '1.8rem',
    borderRadius: '1.5rem',
    boxShadow: `
      inset -3px -3px 6px rgba(255, 255, 255, 0.5),
      inset 3px 3px 6px rgba(174, 174, 192, 0.16)
    `
  },
  navStatusBarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  allProposalsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.5rem',
    opacity: '0.5',
    marginBottom: '1rem'
  },
  statusCardsContainer: {
    marginTop: '1rem',
  },
  contentHeader: {
    marginBottom: '2rem',
    fontSize: '2rem',
  },
  contentBody: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    fontWeight: 300
  }
}))


type VotePageProps = {
  proposal: IProposal
}


const VotePage: FC<VotePageProps> = props => {
  const { proposal } = props
  const styles = useStyles({ status: proposal.status })
  const history = useHistory()

  const handleArrowClick = () => {
    history.push(`/vote`)
  }

  // TODO
  const startTimestamp: number | undefined = 1607216855 // useTimestampFromBlock(proposal.startBlock)
  const endDate: DateTime | undefined = startTimestamp
    ? DateTime.fromSeconds(startTimestamp).plus({ seconds: PROPOSAL_LENGTH_IN_SECS })
    : undefined
  const now: DateTime = DateTime.local()

  // Votes
  const totalVotes: number | undefined = proposal ? proposal.forCount + proposal.againstCount : undefined
  const forPercentage: string = proposal && totalVotes ? ((proposal.forCount * 100) / totalVotes).toFixed(0) + '%' : '0%'
  const againstPercentage: string = proposal && totalVotes ? ((proposal.againstCount * 100) / totalVotes).toFixed(0) + '%' : '0%'

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box className={styles.componentBox}>
        <Box className={styles.navStatusBarContainer}>
          <Button
            className={styles.allProposalsContainer}
            style={{ background: 'unset '}}
            onClick={async (event) => {
              event.preventDefault()
              handleArrowClick()
            }}
          >
            <ArrowLeft size={20} /> All Proposals
          </Button>
          <ProposalStatusCard
            status={proposal.status}
          />
        </Box>

        <Typography variant="h4" className={styles.title}>
          { proposal.title }
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          {endDate && endDate < now
            ? 'Voting ended ' + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
            : proposal
            ? 'Voting ends approximately ' + (endDate && endDate.toLocaleString(DateTime.DATETIME_FULL))
            : ''}
        </Typography>

        <Box display="flex" alignItems="center" className={styles.statusCardsContainer}>
          <VoteStatusCard
            voteStatus={VOTE_STATUS.FOR}
            numVotes={proposal.forCount}
            percentageVotes={forPercentage}
          />
          <VoteStatusCard
            voteStatus={VOTE_STATUS.AGAINST}
            numVotes={proposal.againstCount}
            percentageVotes={againstPercentage}
          />
        </Box>

        <Typography variant="h6" className={styles.contentHeader}>
          Details
        </Typography>
        {proposal.details?.map((d, i) => {
          return (
            <Typography variant="subtitle1" className={styles.contentBody} key={i}>
              {i + 1}: {d.target}.{d.functionSig}(
              {d.callData.split(',').map((content, i) => {
                return (
                  <span key={i}>
                    {content}
                    {d.callData.split(',').length - 1 === i ? '' : ','}
                  </span>
                )
              })}
              )
            </Typography>
          )
        })}

        <Typography variant="h6" className={styles.contentHeader}>
          Description
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          { proposal.description }
        </Typography>

        <Typography variant="h6" className={styles.contentHeader}>
          Proposer
        </Typography>
        <Typography variant="subtitle1" className={styles.contentBody}>
          <a
            href={`https://etherscan.io/address/${proposal.proposer}`}
            style={{ textDecoration: 'none' }}
          >
            { proposal.proposer }
          </a>
        </Typography>
      </Box>
    </Box>
  )
}

export default VotePage 
